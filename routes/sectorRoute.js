const express = require("express");
const authService = require("../services/AuthService");

const {
  createSector,
  deleteSector,
  getOneSector,
  getSector,
  resizeSectorImages,
  updateSector,
  uploadSectorImage,
} = require("../services/sectorService");

const sectorRouter = express.Router();

sectorRouter
  .route("/")
  .get(getSector)
  .post(authService.protect, uploadSectorImage, resizeSectorImages, createSector);

sectorRouter
  .route("/:id")
  .put(authService.protect, uploadSectorImage, resizeSectorImages, updateSector)
  .get(getOneSector)
  .delete(authService.protect, deleteSector);
module.exports = sectorRouter;
