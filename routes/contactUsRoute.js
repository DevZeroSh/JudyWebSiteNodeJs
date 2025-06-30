const express = require("express");
const authService = require("../services/AuthService");

const {
  createContact,
  deleteContact,
  getContact,
  getOneContact,
  updateContact,
  resizeContactImages,
  uploadCompaniesImage,
} = require("../services/contactUsService");

const contactUsRoute = express.Router();

contactUsRoute
  .route("/")
  .get(getContact)
  .post(
    authService.protect,
    uploadCompaniesImage,
    resizeContactImages,
    createContact
  );

contactUsRoute
  .route("/:id")
  .put(
    authService.protect,
    uploadCompaniesImage,
    resizeContactImages,
    updateContact
  )
  .get(getOneContact)
  .delete(authService.protect, deleteContact);

module.exports = contactUsRoute;
