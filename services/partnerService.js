const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const partnersModel = require("../models/partnersModel");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadPartnerImage = uploadSingleImage("photo");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
// Image processing
exports.resizePartnerImages = asyncHandler(async (req, res, next) => {
  const filename = `Partner-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/Partner/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});

exports.getPartner = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [{ name: { $regex: keyword, $options: "i" } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [partner, total] = await Promise.all([
      partnersModel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      partnersModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        partner.length > 0
          ? " partner information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: partner,
    });
  } catch (error) {
    console.error(`Error fetching partner : ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createPartner = asyncHandler(async (req, res, next) => {
  const Partner = await partnersModel.create(req.body);
  res.status(201).json({ data: Partner });
});

exports.getOnePartner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Partner = await partnersModel.findById(id);
  if (!Partner) {
    return next(new ApiError(`No Partner for this id ${id}`, 404));
  }
  res.status(200).json({ data: Partner });
});

exports.updatePartner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedPartner = await partnersModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPartner) {
    return next(new ApiError(`No Partner found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedPartner });
});

exports.deletePartner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Partner = await partnersModel.findByIdAndDelete(id);
  if (!Partner) {
    return next(new ApiError(`No Partner for this id ${id}`, 404));
  }
  res.status(204).send();
});
