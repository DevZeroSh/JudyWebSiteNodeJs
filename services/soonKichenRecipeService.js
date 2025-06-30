const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const soonKitchenRecipe = require("../models/soonKitchenRecipeModel");
const {uploadSingleImage} = require ("../middlewares/uploadingImage")
exports.uploadSoonRecipeImage = uploadSingleImage("photo");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Image processing
exports.resizeSoonRecipeImages = asyncHandler(async (req, res, next) => {
  const filename = `SoonRecipe-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/SoonRecipe/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});
exports.getRecipe = asyncHandler(async (req, res) => {
  const Recipe = await soonKitchenRecipe.find();
  res.status(200).json({ data: Recipe });
});

exports.createRecipe = asyncHandler(async (req, res, next) => {
  const Recipe = await soonKitchenRecipe.create(req.body);
  res.status(201).json({ data: Recipe });
});

exports.getOneRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Recipe = await soonKitchenRecipe.findById(id);
  if (!Recipe) {
    return next(new ApiError(`No Recipe for this id ${id}`, 404));
  }
  res.status(200).json({ data: Recipe });
});

exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedRecipe = await soonKitchenRecipe.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedRecipe) {
    return next(new ApiError(`No Recipe found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedRecipe });
});

exports.deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Recipe = await soonKitchenRecipe.findByIdAndDelete(id);
  if (!Recipe) {
    return next(new ApiError(`No Recipe for this id ${id}`, 404));
  }
  res.status(204).send();
});
