const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  nameAR: { type: String },
  nameEn: { type: String },
  descriptionAR: String,
  descriptionEN: String,
  cardDescriptionEN: String,
  cardDescriptionAR: String,

  photo: String,
});

const setImageURL = (doc) => {
  if (doc.photo) {
    doc.photo = `${process.env.BASE_URL}/ourServices/${doc.photo}`;
  }
};

serviceSchema.post("init", (doc) => {
  setImageURL(doc);
});

serviceSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Service", serviceSchema);
