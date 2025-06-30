const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const boardMemberModel = require("../models/boardMemberModel");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadBoardMemberImage = uploadSingleImage("photo");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Image processing
exports.resizeBoardMemberImages = asyncHandler(async (req, res, next) => {
  const filename = `BoardMember-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/boardMember/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});

exports.getBoardMember = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [
        { position: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [members, total] = await Promise.all([
      boardMemberModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      boardMemberModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        members.length > 0
          ? "Board Member information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: members,
    });
  } catch (error) {
    console.error(`Error fetching members: ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createBoardMember = asyncHandler(async (req, res, next) => {
  const BoardMember = await boardMemberModel.create(req.body);
  res.status(201).json({ data: BoardMember });
});

exports.getOneBoardMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const BoardMember = await boardMemberModel.findById(id);
  if (!BoardMember) {
    return next(new ApiError(`No BoardMember for this id ${id}`, 404));
  }
  res.status(200).json({ data: BoardMember });
});

exports.updateBoardMember = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedBoardMember = await boardMemberModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBoardMember) {
    return next(new ApiError(`No BoardMember found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedBoardMember });
});

exports.deleteBoardMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const BoardMember = await boardMemberModel.findByIdAndDelete(id);
  if (!BoardMember) {
    return next(new ApiError(`No BoardMember for this id ${id}`, 404));
  }
  res.status(204).send();
});
