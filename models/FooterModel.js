const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema({
  descriptionEn: {
    type: String,
    require: true,
  },
  descriptionAr: {
    type: String,
    require: true,
  },
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  twitter: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
  },
});
const FooterModel = mongoose.model("Footer", footerSchema);

module.exports = FooterModel;
