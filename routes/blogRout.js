const express = require("express");

const authService = require("../services/AuthService");
const {
  getBlog,
  createBlog,
  resizeBlogImages,
  uploadBlogImage,
  getOneBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImages,
  getBlogsByCategory,
} = require("../services/blogService");

const BlogRouter = express.Router();

BlogRouter.route("/")
  .get(getBlog)
  .post(authService.protect, uploadBlogImages, resizeBlogImages, createBlog);
BlogRouter.route("/:id")
  .get(getOneBlog)
  .put(authService.protect, uploadBlogImages, resizeBlogImages, updateBlog)
  .delete(authService.protect, deleteBlog);
BlogRouter.route("/blogby_category/:slug").get(getBlogsByCategory);
module.exports = BlogRouter;
