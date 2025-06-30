const express = require("express");
const {
  createLabel,
  deleteLabel,
  getLabel,
  getOneLabel,
  resizeSoonLabelImages,
  updateLabel,
  uploadSoonLabelImage,
} = require("../services/soonKitchenLableService");

const SoonKitchenLabelRouter = express.Router();

SoonKitchenLabelRouter.route("/")
  .get(getLabel)
  .post(uploadSoonLabelImage, resizeSoonLabelImages, createLabel);

SoonKitchenLabelRouter.route("/:id")
  .put(uploadSoonLabelImage, resizeSoonLabelImages, updateLabel)
  .get(getOneLabel)
  .delete(deleteLabel);
module.exports = SoonKitchenLabelRouter;
