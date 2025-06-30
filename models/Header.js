const mongoose = require("mongoose");

const HeaderSchema = new mongoose.Schema({
  titleEn: {
    type: String,

  },
  descriptionEn: {
    type: String,
    require: true,
  },
  titleAr: {
    type: String,

  },
  descriptionAr: {
    type: String,
    require: true,
  },
  link: {
    type: String,
  },
});
const HeaderModel = mongoose.model("Header", HeaderSchema);

module.exports = HeaderModel;
