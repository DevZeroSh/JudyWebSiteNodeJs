const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const setImageURL = (doc) => {
  if (doc.photo) {
    doc.photo = `${process.env.BASE_URL}/Partner/${doc.photo}`;
  }
};

partnerSchema.post("init", (doc) => {
  setImageURL(doc);
});

partnerSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("partners", partnerSchema);
