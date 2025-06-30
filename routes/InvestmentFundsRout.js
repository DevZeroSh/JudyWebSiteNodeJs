const express = require("express");
const authService = require("../services/AuthService");

const {
  createInvestmentFunds,
  deleteInvestmentFunds,
  getInvestmentFunds,
  getOneInvestmentFunds,
  resizeInvestmentFundsImages,
  updateInvestmentFunds,
  uploadInvestmentFundsImage,
} = require(".././services/investmentFunds");

const InvestmentFundsRout = express.Router();

InvestmentFundsRout.route("/")
  .get(getInvestmentFunds)
  .post(
    authService.protect,
    uploadInvestmentFundsImage,
    resizeInvestmentFundsImages,
    createInvestmentFunds
  );
InvestmentFundsRout.route("/:id")
  .get(getOneInvestmentFunds)
  .put(
    authService.protect,
    uploadInvestmentFundsImage,
    resizeInvestmentFundsImages,
    updateInvestmentFunds
  )
  .delete(authService.protect, deleteInvestmentFunds);
module.exports = InvestmentFundsRout;
