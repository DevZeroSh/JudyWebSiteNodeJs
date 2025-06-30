const express = require("express");
const authService = require("../services/AuthService");

const {
  createLocation,
  deleteLocation,
  getLocation,
  getOneLocation,
  resizeLocationImages,
  updateLocation,
  uploadLocationImage,
} = require(".././services/locationService");

const InvestmentFundsRout = express.Router();

InvestmentFundsRout.route("/")
  .get(getLocation)
  .post(
    authService.protect,
    uploadLocationImage,
    resizeLocationImages,
    createLocation
  );
InvestmentFundsRout.route("/:id")
  .get(getOneLocation)
  .put(
    authService.protect,
    uploadLocationImage,
    resizeLocationImages,
    updateLocation
  )
  .delete(authService.protect, deleteLocation);
module.exports = InvestmentFundsRout;
