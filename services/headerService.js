const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const headerModel = require("../models/Header");

exports.getHeader = asyncHandler(async (req, res) => {
  const Header = await headerModel.find().sort({ createdAt: -1 });
  if (!Header || Header.length === 0) {
    return res.status(404).json({ message: "No Header found" });
  }
  res.status(200).json({ data: Header });
});

exports.createHeader = asyncHandler(async (req, res, next) => {
  const Header = await headerModel.create(req.body);
  res.status(201).json({ data: Header });
});

exports.getOneHeader = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Header = await headerModel.findById(id);
  if (!Header) {
    return next(new ApiError(`No Header for this id ${id}`, 404));
  }
  res.status(200).json({ data: Header });
});

exports.updateHeader = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedHeader = await headerModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedHeader) {
    return next(new ApiError(`No Header found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedHeader });
});

exports.deleteHeader = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Header = await headerModel.findByIdAndDelete(id);
  if (!Header) {
    return next(new ApiError(`No Header for this id ${id}`, 404));
  }
  res.status(204).send();
});
