const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const soonKitchen = require("../models/soonKitchenModel");
const {uploadSingleImage} = require ("../middlewares/uploadingImage")
exports.uploadSoonImage = uploadSingleImage("photo");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Image processing
exports.resizeSoonImages = asyncHandler(async (req, res, next) => {
  const filename = `Soon-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/Soon/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});

exports.getKitchen = asyncHandler(async (req, res) => {
  const Kitchen = await soonKitchen.find();
  res.status(200).json({ data: Kitchen });
});

exports.createKitchen = asyncHandler(async (req, res, next) => {
  const Kitchen = await soonKitchen.create(req.body);
  res.status(201).json({ data: Kitchen });
});

exports.getOneKitchen = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Kitchen = await soonKitchen.findById(id);
  if (!Kitchen) {
    return next(new ApiError(`No Kitchen for this id ${id}`, 404));
  }
  res.status(200).json({ data: Kitchen });
});

exports.updateKitchen = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedKitchen = await soonKitchen.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedKitchen) {
    return next(new ApiError(`No Kitchen found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedKitchen });
});

exports.deleteKitchen = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Kitchen = await soonKitchen.findByIdAndDelete(id);
  if (!Kitchen) {
    return next(new ApiError(`No Kitchen for this id ${id}`, 404));
  }
  res.status(204).send();
});
