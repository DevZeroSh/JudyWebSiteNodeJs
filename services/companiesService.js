const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const companiesModel = require("../models/Companies");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadCompaniesImage = uploadSingleImage("photo");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
// Image processing
exports.resizeCompaniesImages = asyncHandler(async (req, res, next) => {
  const filename = `Companies-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/Companies/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});

exports.getCompanies = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [{ descriptionEN: { $regex: keyword, $options: "i" } }];
      query.$or = [{ title: { $regex: keyword, $options: "i" } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [companies, total] = await Promise.all([
      companiesModel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      companiesModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        companies.length > 0
          ? "Companies information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: companies,
    });
  } catch (error) {
    console.error(`Error fetching companies : ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createCompanies = asyncHandler(async (req, res, next) => {
  const Companies = await companiesModel.create(req.body);
  res.status(201).json({ data: Companies });
});

exports.getOneCompanies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Companies = await companiesModel.findById(id);
  if (!Companies) {
    return next(new ApiError(`No Companies for this id ${id}`, 404));
  }
  res.status(200).json({ data: Companies });
});

exports.updateCompanies = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedCompanies = await companiesModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCompanies) {
    return next(new ApiError(`No Companies found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedCompanies });
});

exports.deleteCompanies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Companies = await companiesModel.findByIdAndDelete(id);
  if (!Companies) {
    return next(new ApiError(`No Companies for this id ${id}`, 404));
  }
  res.status(204).send();
});
