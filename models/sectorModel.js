const mongoose = require("mongoose");

const sectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    relatedFunds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fund",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const setImageURl = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/sector/${doc.photo}`;
    doc.photo = imageUrl;
  }
};
sectorSchema.post("init", (doc) => {
  setImageURl(doc);
});
sectorSchema.post("save", (doc) => {
  setImageURl(doc);
});

module.exports = mongoose.model("Sector", sectorSchema);
