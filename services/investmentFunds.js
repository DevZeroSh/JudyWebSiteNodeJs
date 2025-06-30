const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const investmentFundsModel = require("../models/InvestmentFunds");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadInvestmentFundsImage = uploadSingleImage("photo");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Image processing
exports.resizeInvestmentFundsImages = asyncHandler(async (req, res, next) => {
  const filename = `InvestmentFunds-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/InvestmentFunds/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});

exports.getInvestmentFunds = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [{ name: { $regex: keyword, $options: "i" } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [funds, total] = await Promise.all([
      investmentFundsModel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      investmentFundsModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        funds.length > 0
          ? "Investment Funds information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: funds,
    });
  } catch (error) {
    console.error(`Error fetching funds : ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createInvestmentFunds = asyncHandler(async (req, res, next) => {
  const InvestmentFunds = await investmentFundsModel.create(req.body);
  res.status(201).json({ data: InvestmentFunds });
});

exports.getOneInvestmentFunds = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const InvestmentFunds = await investmentFundsModel.findById(id);
  if (!InvestmentFunds) {
    return next(new ApiError(`No InvestmentFunds for this id ${id}`, 404));
  }
  res.status(200).json({ data: InvestmentFunds });
});

exports.updateInvestmentFunds = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedInvestmentFunds = await investmentFundsModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedInvestmentFunds) {
    return next(
      new ApiError(`No InvestmentFunds found for this id: ${id}`, 404)
    );
  }

  res.status(200).json({ data: updatedInvestmentFunds });
});

exports.deleteInvestmentFunds = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const InvestmentFunds = await investmentFundsModel.findByIdAndDelete(id);
  if (!InvestmentFunds) {
    return next(new ApiError(`No InvestmentFunds for this id ${id}`, 404));
  }
  res.status(204).send();
});
