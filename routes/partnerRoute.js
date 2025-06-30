const express = require("express");
const authService = require("../services/AuthService");

const {
  createPartner,
  deletePartner,
  getOnePartner,
  getPartner,
  resizePartnerImages,
  updatePartner,
  uploadPartnerImage,
} = require(".././services/partnerService");

const partnerRouter = express.Router();

partnerRouter
  .route("/")
  .get(getPartner)
  .post(authService.protect, uploadPartnerImage, resizePartnerImages, createPartner);
partnerRouter
  .route("/:id")
  .get(getOnePartner)
  .put(authService.protect, uploadPartnerImage, resizePartnerImages, updatePartner)
  .delete(authService.protect, deletePartner);
module.exports = partnerRouter;
