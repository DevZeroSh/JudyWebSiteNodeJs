const mongoose = require("mongoose");

const CompaniySchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  descriptionAR: {
    type: String,
    require: true,
  },
  descriptionEN: {
    type: String,
    require: true,
  },
  cardDescriptionEN: String,
  cardDescriptionAR: String,
  photo: {
    type: String,
    require: true,
  },
});
const setImageURl = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/companies/${doc.photo}`;
    doc.photo = imageUrl;
  }
};
CompaniySchema.post("init", (doc) => {
  setImageURl(doc);
});
CompaniySchema.post("save", (doc) => {
  setImageURl(doc);
});

const CompaniyModel = mongoose.model("Companies", CompaniySchema);

module.exports = CompaniyModel;
