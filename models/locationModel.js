const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const setImageURl = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/Location/${doc.photo}`;
    doc.photo = imageUrl;
  }
};
locationSchema.post("init", (doc) => {
  setImageURl(doc);
});
locationSchema.post("save", (doc) => {
  setImageURl(doc);
});

module.exports = mongoose.model("location", locationSchema);
