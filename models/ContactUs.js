const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      require: true,
    },
    location2: {
      type: String,
      require: true,
    },
    photo: String,
    Email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const setImageURl = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/Contact/${doc.photo}`;
    doc.photo = imageUrl;
  }
};
ContactSchema.post("init", (doc) => {
  setImageURl(doc);
});
ContactSchema.post("save", (doc) => {
  setImageURl(doc);
});
const ContactModel = mongoose.model("Contact", ContactSchema);

module.exports = ContactModel;
