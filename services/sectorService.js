const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sectorModel = require("../models/sectorModel");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadSectorImage = uploadSingleImage("photo");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Image processing
exports.resizeSectorImages = asyncHandler(async (req, res, next) => {
  const filename = `Sector-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/sector/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});

exports.getSector = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [{ name: { $regex: keyword, $options: "i" } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sectors, total] = await Promise.all([
      sectorModel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      sectorModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        sectors.length > 0
          ? " sectors information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: sectors,
    });
  } catch (error) {
    console.error(`Error fetching sectors : ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


exports.createSector = asyncHandler(async (req, res, next) => {
  const Sector = await sectorModel.create(req.body);
  res.status(201).json({ data: Sector });
});

exports.getOneSector = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Sector = await sectorModel.findById(id);
  if (!Sector) {
    return next(new ApiError(`No Sector for this id ${id}`, 404));
  }
  res.status(200).json({ data: Sector });
});

exports.updateSector = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedSector = await sectorModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedSector) {
    return next(new ApiError(`No Sector found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedSector });
});

exports.deleteSector = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Sector = await sectorModel.findByIdAndDelete(id);
  if (!Sector) {
    return next(new ApiError(`No Sector for this id ${id}`, 404));
  }
  res.status(204).send();
});
