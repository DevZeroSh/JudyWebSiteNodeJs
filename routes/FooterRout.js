const express = require("express");
const authService = require("../services/AuthService");

const {
  createFooter,
  getFooter,
  getOneFooter,
  updateFooter,
  deleteFooter,
} = require("../services/footerServices");

const footerRout = express.Router();

footerRout.route("/").get(getFooter).post(authService.protect, createFooter);
footerRout
  .route("/:id")
  .get(getOneFooter)
  .put(authService.protect, updateFooter)
  .delete(authService.protect, deleteFooter);

module.exports = footerRout;
