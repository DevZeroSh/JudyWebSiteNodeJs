const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: String
});
const setImageURL = (doc) => {
    if (doc.photo) {
        const imageUrl = `${process.env.BASE_URL}/SoonLabel/${doc.photo}`;
        doc.photo = imageUrl;
    }
}
LabelSchema.post("init", (doc) => {
    setImageURL(doc);
});

LabelSchema.post("save", (doc) => {
    setImageURL(doc);
});

const HeaderModel = mongoose.model("label", LabelSchema);

module.exports = HeaderModel;
