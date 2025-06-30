const express = require("express");
const authService = require("../services/AuthService");

const {
  createInvestmentFields,
  deleteInvestmentFields,
  getInvestmentFields,
  getOneInvestmentFields,
  updateInvestmentFields,
} = require(".././services/investmentFields");

const InvestmentFundsRout = express.Router();

InvestmentFundsRout.route("/")
  .get(getInvestmentFields)
  .post(authService.protect, createInvestmentFields);
InvestmentFundsRout.route("/:id")
  .get(getOneInvestmentFields)
  .put(authService.protect, updateInvestmentFields)
  .delete(authService.protect, deleteInvestmentFields);
module.exports = InvestmentFundsRout;
