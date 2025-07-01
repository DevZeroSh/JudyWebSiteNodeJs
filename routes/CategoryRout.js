const express = require("express");

const authService = require("../services/AuthService");
const {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getOneCategory,
} = require("../services/categoryService");

const CategoryRouter = express.Router();

CategoryRouter.route("/").get(getCategory).post(authService.protect, createCategory);
CategoryRouter.route("/:id")
  .put(authService.protect, updateCategory)
  .delete(authService.protect, deleteCategory)
  .get(getOneCategory);

module.exports = CategoryRouter;
