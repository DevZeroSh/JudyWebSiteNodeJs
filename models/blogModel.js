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

    photo: { type: String, require: true },
    images: String,
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
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/blog/${doc.photo}`;
    doc.photo = imageUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/blog/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
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
