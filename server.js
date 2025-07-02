const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const dbConnection = require("./config/database");
const authRouter = require("./routes/AuthRout");
const BlogRouter = require("./routes/blogRout");
const SoonKitchenRouter = require("./routes/soonKitchenRout");
const SoonKitchenLabelRouter = require("./routes/soonKitchenLableRout");
const soonKitchenRecipeRout = require("./routes/soonKitchenRecipeRout");
const CategoryRouter = require("./routes/CategoryRout");
const boardMemberRouter = require("./routes/boardMemberRoute");
const partnerRouter = require("./routes/partnerRoute");
const headerRouter = require("./routes/HeaderRout");
const investmentFieldsRouter = require("./routes/investmentFields");
const investmentFundsRouter = require("./routes/InvestmentFundsRout");
const footerRouter = require("./routes/FooterRout");
const contactUsRouter = require("./routes/contactUsRoute");
const companiesRouter = require("./routes/CompaniesRout");
const sectorsRoter = require("./routes/sectorRoute");
const ServiceRouter = require("./routes/ServicesRoute");
const locationRouter = require("./routes/locationRoute");

dotenv.config({ path: "config.env" });

dbConnection();

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/api/blog", BlogRouter);
app.use("/api/soonkitchen", SoonKitchenRouter);
app.use("/api/soonkitchenlabel", SoonKitchenLabelRouter);
app.use("/api/soonkitchenrecipe", soonKitchenRecipeRout);
app.use("/api/category", CategoryRouter);
app.use("/api/boardMember", boardMemberRouter);
app.use("/api/auth", authRouter);
app.use("/api/partners", partnerRouter);
app.use("/api/header", headerRouter);
app.use("/api/investmentFields", investmentFieldsRouter);
app.use("/api/investmentFunds", investmentFundsRouter);
app.use("/api/footer", footerRouter);
app.use("/api/contactus", contactUsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/sectors", sectorsRoter);
app.use("/api/services", ServiceRouter);
app.use("/api/location", locationRouter);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
