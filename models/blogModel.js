const { config } = require("dotenv");
const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
      tr: { type: String, required: true },
    },
    content: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
      tr: { type: String, required: true },
    },
    slug: { type: String, unique: true, required: true },

    coverImage: { type: String, require: true },
    thumbnailImage: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    published: { type: Boolean, default: false },
    tags: {
      en: { type: [String], default: [] },
      ar: { type: [String], default: [] },
      tr: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  console.log(doc);
  
  if (doc.coverImage) {
    const imageUrl = `${process.env.BASE_URL}/blog/${doc.coverImage}`;
    doc.coverImage = imageUrl;
  }
  if (doc.thumbnailImage) {
    const imageList = [];
    doc.thumbnailImage.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/blog/${image}`;
      imageList.push(imageUrl);
    });
    doc.thumbnailImage = imageList;
  }
};

BlogSchema.post("init", (doc) => {
  setImageURL(doc);
});

//Create
BlogSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Blogs", BlogSchema);
