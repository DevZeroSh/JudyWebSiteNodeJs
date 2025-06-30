const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const serviceModel = require("../models/ourServicesModel");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadServiceImage = uploadSingleImage("photo");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Image processing
exports.resizeServicesImages = asyncHandler(async (req, res, next) => {
  const filename = `Services-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/ourServices/${filename}`);

    // Save image into our db
    req.body.photo = filename;
  }

  next();
});

exports.getServices = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [{ descriptionEN: { $regex: keyword, $options: "i" } }];
      query.$or = [{ nameEn: { $regex: keyword, $options: "i" } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [services, total] = await Promise.all([
      serviceModel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      serviceModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        services.length > 0
          ? "services information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: services,
    });
  } catch (error) {
    console.error(`Error fetching services : ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createServices = asyncHandler(async (req, res, next) => {
  const Services = await serviceModel.create(req.body);
  res.status(201).json({ data: Services });
});

exports.getOneServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Services = await serviceModel.findById(id);
  if (!Services) {
    return next(new ApiError(`No Services for this id ${id}`, 404));
  }
  res.status(200).json({ data: Services });
});

exports.updateServices = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedServices = await serviceModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedServices) {
    return next(new ApiError(`No Services found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedServices });
});

exports.deleteServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Services = await serviceModel.findByIdAndDelete(id);
  if (!Services) {
    return next(new ApiError(`No Services for this id ${id}`, 404));
  }
  res.status(204).send();
});
