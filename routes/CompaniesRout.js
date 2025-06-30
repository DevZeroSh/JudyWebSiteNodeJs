const express = require("express");
const authService = require("../services/AuthService");

const {
  createCompanies,
  deleteCompanies,
  getCompanies,
  getOneCompanies,
  resizeCompaniesImages,
  updateCompanies,
  uploadCompaniesImage,
} = require("../services/companiesService");

const CompaniesRout = express.Router();

CompaniesRout.route("/")
  .get(getCompanies)
  .post(
    authService.protect,
    uploadCompaniesImage,
    resizeCompaniesImages,
    createCompanies
  );

CompaniesRout.route("/:id")
  .put(
    authService.protect,
    uploadCompaniesImage,
    resizeCompaniesImages,
    updateCompanies
  )
  .get(getOneCompanies)
  .delete(authService.protect, deleteCompanies);

module.exports = CompaniesRout;
