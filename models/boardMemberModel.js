const mongoose = require("mongoose");

const boardMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
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
    linkedIn: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const setImageURL = (doc) => {
  if (doc.photo) {
    doc.photo = `${process.env.BASE_URL}/boardMember/${doc.photo}`;
  }
};

boardMemberSchema.post("init", (doc) => {
  setImageURL(doc);
});

boardMemberSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("BoardMember", boardMemberSchema);
