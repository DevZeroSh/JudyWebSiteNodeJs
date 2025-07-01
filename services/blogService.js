const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const blogModel = require("../models/blogModel");

const {
  uploadSingleImage,
  uploadMixOfImages,
} = require("../middlewares/uploadingImage");
exports.uploadBlogImage = uploadSingleImage("photo");
exports.uploadBlogImages = uploadMixOfImages([
  { name: "photo", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { default: slugify } = require("slugify");

// Image processing
exports.resizeBlogImages = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.photo) {
    const photoFilename = `Blog-${uuidv4()}-${Date.now()}.webp`;

    await sharp(req.files.photo[0].buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/Blog/${photoFilename}`);

    req.body.photo = photoFilename;
  }

  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file) => {
        const filename = `Blog-${uuidv4()}-${Date.now()}.webp`;
        await sharp(file.buffer)
          .toFormat("webp")
          .webp({ quality: 70 })
          .toFile(`uploads/Blog/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.getBlog = asyncHandler(async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== "") {
      query.$or = [
        { titleEN: { $regex: keyword, $options: "i" } },
        { descriptionEN: { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [blogs, total] = await Promise.all([
      blogModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("category"),
      blogModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message:
        blogs.length > 0
          ? "Blogs information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1,
      },
      data: blogs,
    });
  } catch (error) {
    console.error(`Error fetching blogs: ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createBlog = asyncHandler(async (req, res, next) => {
  req.body.title = JSON.parse(req.body.title);
  req.body.content = JSON.parse(req.body.content);
  req.body.tags = JSON.parse(req.body.tags);
  req.body.slug = slugify(req.body.title.en);

  const Blog = await blogModel.create(req.body);
  res.status(201).json({ data: Blog });
});

exports.getOneBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Blog = await blogModel.findById(id);
  if (!Blog) {
    return next(new ApiError(`No Blog for this id ${id}`, 404));
  }
  res.status(200).json({ data: Blog });
});

exports.updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.title = JSON.parse(req.body.title);
  req.body.content = JSON.parse(req.body.content);
  req.body.tags = JSON.parse(req.body.tags);
  req.body.slug = slugify(req.body.title.en);
  const updatedBlog = await blogModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBlog) {
    return next(new ApiError(`No Blog found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedBlog });
});

exports.deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Blog = await blogModel.findByIdAndDelete(id);
  if (!Blog) {
    return next(new ApiError(`No Blog for this id ${id}`, 404));
  }
  res.status(204).send();
});
