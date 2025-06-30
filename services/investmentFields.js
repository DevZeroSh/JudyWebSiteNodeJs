const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const investmentFieldsModel = require("../models/InvestmentFields");

exports.getInvestmentFields = asyncHandler(async (req, res) => {
  const InvestmentFields = await investmentFieldsModel
    .find()
    .sort({ createdAt: -1 });
  if (!InvestmentFields || InvestmentFields.length === 0) {
    return res.status(404).json({ message: "No InvestmentFields found" });
  }
  res.status(200).json({ data: InvestmentFields });
});

exports.createInvestmentFields = asyncHandler(async (req, res, next) => {
  const InvestmentFields = await investmentFieldsModel.create(req.body);
  res.status(201).json({ data: InvestmentFields });
});

exports.getOneInvestmentFields = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const InvestmentFields = await investmentFieldsModel.findById(id);
  if (!InvestmentFields) {
    return next(new ApiError(`No InvestmentFields for this id ${id}`, 404));
  }
  res.status(200).json({ data: InvestmentFields });
});

exports.updateInvestmentFields = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedInvestmentFields = await investmentFieldsModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedInvestmentFields) {
    return next(
      new ApiError(`No InvestmentFields found for this id: ${id}`, 404)
    );
  }

  res.status(200).json({ data: updatedInvestmentFields });
});

exports.deleteInvestmentFields = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const InvestmentFields = await investmentFieldsModel.findByIdAndDelete(id);
  if (!InvestmentFields) {
    return next(new ApiError(`No InvestmentFields for this id ${id}`, 404));
  }
  res.status(204).send();
});
