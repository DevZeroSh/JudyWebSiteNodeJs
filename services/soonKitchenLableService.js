const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const soonKitchenLabel = require("../models/soonKitchenLabelModel");
const {uploadSingleImage} = require ("../middlewares/uploadingImage")
exports.uploadSoonLabelImage = uploadSingleImage("photo");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Image processing
exports.resizeSoonLabelImages = asyncHandler(async (req, res, next) => {
  const filename = `SoonLabel-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/SoonLabel/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});


exports.getLabel = asyncHandler(async (req, res) => {
  const Label = await soonKitchenLabel.find();
  res.status(200).json({ data: Label });
});

exports.createLabel = asyncHandler(async (req, res, next) => {
  const Label = await soonKitchenLabel.create(req.body);
  res.status(201).json({ data: Label });
});

exports.getOneLabel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Label = await soonKitchenLabel.findById(id);
  if (!Label) {
    return next(new ApiError(`No Label for this id ${id}`, 404));
  }
  res.status(200).json({ data: Label });
});

exports.updateLabel = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedLabel = await soonKitchenLabel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedLabel) {
    return next(new ApiError(`No Label found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedLabel });
});

exports.deleteLabel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Label = await soonKitchenLabel.findByIdAndDelete(id);
  if (!Label) {
    return next(new ApiError(`No Label for this id ${id}`, 404));
  }
  res.status(204).send();
});
