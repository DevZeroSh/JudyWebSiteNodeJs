const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  ingredients: [{ name: String, weight: String, calories: String }],
  price: { type: Number, required: true },
  rate: { type: Number },
  labelsName: { type: String },
  labelsId: { type: String },
  desc: { type: String, required: true },
});
const setImageURL = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/SoonRecipe/${doc.photo}`;
    doc.photo = imageUrl;
  }
};
RecipeSchema.post("init", (doc) => {
  setImageURL(doc);
});

RecipeSchema.post("save", (doc) => {
  setImageURL(doc);
});

const RecipeModel = mongoose.model("Recipe", RecipeSchema);

module.exports = RecipeModel;
