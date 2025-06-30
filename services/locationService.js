const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const locationModel = require("../models/locationModel");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadLocationImage = uploadSingleImage("photo");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Image processing
exports.resizeLocationImages = asyncHandler(async (req, res, next) => {
  const filename = `Location-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/Location/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});

exports.getLocation = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [{ name: { $regex: keyword, $options: "i" } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [funds, total] = await Promise.all([
      locationModel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      locationModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        funds.length > 0
          ? "Location information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: funds,
    });
  } catch (error) {
    console.error(`Error fetching funds : ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createLocation = asyncHandler(async (req, res, next) => {
  const Location = await locationModel.create(req.body);
  res.status(201).json({ data: Location });
});

exports.getOneLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Location = await locationModel.findById(id);
  if (!Location) {
    return next(new ApiError(`No Location for this id ${id}`, 404));
  }
  res.status(200).json({ data: Location });
});

exports.updateLocation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedLocation = await locationModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedLocation) {
    return next(
      new ApiError(`No Location found for this id: ${id}`, 404)
    );
  }

  res.status(200).json({ data: updatedLocation });
});

exports.deleteLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Location = await locationModel.findByIdAndDelete(id);
  if (!Location) {
    return next(new ApiError(`No Location for this id ${id}`, 404));
  }
  res.status(204).send();
});
