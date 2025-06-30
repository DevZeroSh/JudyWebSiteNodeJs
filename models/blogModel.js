const { config } = require("dotenv");
const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    titleEN: {
      type: String,
    },
    titleAR: {
      type: String,
    },

    descriptionEN: {
      type: String,
      require: true,
    },
    descriptionAR: {
      type: String,
      require: true,
    },
    photo: { type: String, require: true },
    images: [String],
    writer: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },

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
