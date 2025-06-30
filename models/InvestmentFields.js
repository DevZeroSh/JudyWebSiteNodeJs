const mongoose = require("mongoose");

const InvestmentFields = mongoose.Schema({
  titleEn: {
    type: String,
  },
  titleAr: {
    type: String,
  },
});

const InvestmentFieldsModel = mongoose.model(
  "InestmenyFields",
  InvestmentFields
);

module.exports = InvestmentFieldsModel;
