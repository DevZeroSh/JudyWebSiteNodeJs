const express = require("express");
const authService = require("../services/AuthService");

const {
  createServices,
  deleteServices,
  getOneServices,
  getServices,
  resizeServicesImages,
  updateServices,
  uploadServiceImage,
} = require("../services/ourServicesService");

const serviceRoute = express.Router();

serviceRoute
  .route("/")
  .get(getServices)
  .post(authService.protect, uploadServiceImage, resizeServicesImages, createServices);
serviceRoute
  .route("/:id")
  .put(authService.protect, uploadServiceImage, resizeServicesImages, updateServices)
  .delete(authService.protect, deleteServices)
  .get(getOneServices);
module.exports = serviceRoute;
