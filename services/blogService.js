const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const blogModel = require("../models/blogModel");

const {
  uploadSingleImage,
  uploadMixOfImages,
} = require("../middlewares/uploadingImage");
exports.uploadBlogImage = uploadSingleImage("coverImage");
exports.uploadBlogImages = uploadMixOfImages([
  { name: "coverImage", maxCount: 1 },
  { name: "thumbnailImage", maxCount: 10 },
]);

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { default: slugify } = require("slugify");
const categoryModel = require("../models/categoryModel");

// Image processing
exports.resizeBlogImages = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.coverImage) {
    const photoFilename = `Blog-${uuidv4()}-${Date.now()}.webp`;

    await sharp(req.files.coverImage[0].buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/Blog/${photoFilename}`);

    req.body.coverImage = photoFilename;
  }

  if (req.files && req.files.thumbnailImage) {
    req.body.thumbnailImage = [];
    await Promise.all(
      req.files.thumbnailImage.map(async (file) => {
        const filename = `Blog-${uuidv4()}-${Date.now()}.webp`;
        await sharp(file.buffer)
          .toFormat("webp")
          .webp({ quality: 70 })
          .toFile(`uploads/Blog/${filename}`);
        req.body.thumbnailImage.push(filename);
      })
    );
  }

  next();
});

exports.getBlog = asyncHandler(async (req, res, next) => {
  try {
    const {
      keyword = req.query.keyword,
      page = req.query.page || 1,
      limit = req.query.limit || 10,
      sort = "-createdAt",
    } = req.query;

    const query = {};
    let categoryIds = [];
    if (keyword && keyword.trim() !== "") {
      const matchedCategories = await categoryModel.find({
        $or: [
          { "name.en": { $regex: keyword, $options: "i" } },
          { "name.ar": { $regex: keyword, $options: "i" } },
          { "name.ar": { $regex: keyword, $options: "i" } },
        ],
      });

      categoryIds = matchedCategories.map((cat) => cat._id);
      query.$or = [
        { "title.en": { $regex: keyword, $options: "i" } },
        { "title.ar": { $regex: keyword, $options: "i" } },
        { "title.tr": { $regex: keyword, $options: "i" } },
        { "tags.en": { $regex: keyword, $options: "i" } },
        { "tags.ar": { $regex: keyword, $options: "i" } },
        { "tags.tr": { $regex: keyword, $options: "i" } },
        { category: { $in: categoryIds } },
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
  if (req.body.title) req.body.title = JSON.parse(req.body.title);
  if (req.body.content) req.body.content = JSON.parse(req.body.content);
  if (req.body.tags) req.body.tags = JSON.parse(req.body.tags);
  if (req.body.title?.en) req.body.slug = slugify(req.body.title.en);
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

exports.getBlogsByCategory = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const category = await categoryModel.findOne({ slug });
  if (!category) {
    return next(new ApiError(`No category found with slug: ${slug}`, 404));
  }

  const blogs = await blogModel
    .find({ category: category._id })
    .populate("category");

  res.status(200).json({
    status: true,
    count: blogs.length,
    data: blogs,
  });
});
