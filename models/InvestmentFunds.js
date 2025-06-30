const mongoose = require("mongoose");

const fundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["NOONTEK Fund", "PLATNUM Fund", "URANUS Fund"],
    },
    idea: {
      type: String,
      required: true,
    },
    targetSectors: {
      type: [String],
      required: true,
    },
    investmentVolume: {
      type: Number,
      required: true,
    },
    performance: {
      type: {
        averageReturn: Number,
        notes: String,
      },
      default: {},
    },
    subscriptionMethod: {
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
    const imageUrl = `${process.env.BASE_URL}/InvestmentFunds/${doc.photo}`;
    doc.photo = imageUrl;
  }
};
fundSchema.post("init", (doc) => {
  setImageURl(doc);
});
fundSchema.post("save", (doc) => {
  setImageURl(doc);
});

module.exports = mongoose.model("Fund", fundSchema);
