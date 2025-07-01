const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const categoryModel = require("../models/categoryModel");
const { default: slugify } = require("slugify");

exports.getCategory = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [{ name: { $regex: keyword, $options: "i" } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [category, total] = await Promise.all([
      categoryModel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      categoryModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        category.length > 0
          ? "Category information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: category,
    });
  } catch (error) {
    console.error(`Error fetching category : ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name.en);
  const Category = await categoryModel.create(req.body);
  res.status(201).json({ data: Category });
});

exports.getOneCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Category = await categoryModel.findById(id);
  if (!Category) {
    return next(new ApiError(`No Category for this id ${id}`, 404));
  }
  res.status(200).json({ data: Category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedCategory = await categoryModel.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCategory) {
    return next(new ApiError(`No Category found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedCategory });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Category = await categoryModel.findByIdAndDelete(id);
  if (!Category) {
    return next(new ApiError(`No Category for this id ${id}`, 404));
  }
  res.status(204).send();
});

