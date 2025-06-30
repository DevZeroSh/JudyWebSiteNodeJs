const express = require("express");
const {
  createKitchen,
  deleteKitchen,
  getKitchen,
  getOneKitchen,
  resizeSoonImages,
  updateKitchen,
  uploadSoonImage,
} = require("../services/soonKitchenService");

const SoonKitchenRouter = express.Router();

SoonKitchenRouter.route("/")
  .get(getKitchen)
  .post(uploadSoonImage, resizeSoonImages, createKitchen);

SoonKitchenRouter.route("/:id")
  .get(getOneKitchen)
  .put(uploadSoonImage, resizeSoonImages, updateKitchen)
  .delete(deleteKitchen);
module.exports = SoonKitchenRouter;
