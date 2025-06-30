const express = require("express");
const authService = require("../services/AuthService");

const {
  getHeader,
  createHeader,
  updateHeader,
  deleteHeader,
  getOneHeader,
} = require(".././services/headerService");

const HeaderRouter = express.Router();
HeaderRouter.use(authService.protect);

HeaderRouter.route("/").get(getHeader).post(authService.protect, createHeader);
HeaderRouter.route("/:id")
  .put(authService.protect, updateHeader)
  .delete(authService.protect, deleteHeader)
  .get(getOneHeader);
module.exports = HeaderRouter;
