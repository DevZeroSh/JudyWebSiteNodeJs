const express = require("express");
const {
  createRecipe,
  deleteRecipe,
  getOneRecipe,
  getRecipe,
  resizeSoonRecipeImages,
  updateRecipe,
  uploadSoonRecipeImage,
} = require("../services/soonKichenRecipeService");

const soonKitchenRecipeRout = express.Router();

soonKitchenRecipeRout
  .route("/")
  .get(getRecipe)
  .post(uploadSoonRecipeImage, resizeSoonRecipeImages, createRecipe);
soonKitchenRecipeRout
  .route("/:id")
  .delete(deleteRecipe)
  .put(uploadSoonRecipeImage, resizeSoonRecipeImages, updateRecipe)
  .get(getOneRecipe);

module.exports = soonKitchenRecipeRout;
