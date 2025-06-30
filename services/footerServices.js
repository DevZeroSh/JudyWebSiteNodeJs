const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const footerModel = require("../models/FooterModel");

exports.getFooter = asyncHandler(async (req, res) => {
  const Footer = await footerModel.find().sort({ createdAt: -1 });
  if (!Footer || Footer.length === 0) {
    return res.status(404).json({ message: "No Footer found" });
  }
  res.status(200).json({ data: Footer });
});

exports.createFooter = asyncHandler(async (req, res) => {
  const Footer = await footerModel.create(req.body);
  res.status(201).json({ data: Footer });
});

exports.getOneFooter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Footer = await footerModel.findById(id);
  if (!Footer) {
    return next(new ApiError(`No Footer for this id ${id}`, 404));
  }
  res.status(200).json({ data: Footer });
});

exports.updateFooter = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedFooter = await footerModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedFooter) {
    return next(new ApiError(`No Footer found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedFooter });
});

exports.deleteFooter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Footer = await footerModel.findByIdAndDelete(id);
  if (!Footer) {
    return next(new ApiError(`No Footer for this id ${id}`, 404));
  }
  res.status(204).send();
});
