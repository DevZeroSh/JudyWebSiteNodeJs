const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: String,
      ar: String,
      tr: String,
    },
    slug: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
