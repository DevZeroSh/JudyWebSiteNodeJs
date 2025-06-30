const mongoose = require("mongoose");

const soonKitchenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String },
    photo: { type: String },
    labels: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "label",
      },
    ],
    recipe: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/Soon/${doc.photo}`;
    doc.photo = imageUrl;
  }
};
soonKitchenSchema.post("init", (doc) => {
  setImageURL(doc);
});

soonKitchenSchema.post("save", (doc) => {
  setImageURL(doc);
});

const soonKitchen = mongoose.model("BrandKitchen", soonKitchenSchema);

module.exports = soonKitchen;
