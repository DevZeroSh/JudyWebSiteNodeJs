const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const dbConnection = require("./config/database");

const authRouter = require("./routes/AuthRout");

const BlogRouter = require("./routes/blogRout");
const SoonKitchenRouter = require("./routes/soonKitchenRout");
const SoonKitchenLabelRouter = require("./routes/soonKitchenLableRout");
const soonKitchenRecipeRout = require("./routes/soonKitchenRecipeRout");
const CategoryRouter = require("./routes/CategoryRout");

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
// Catch-all route for client-side routing
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "soondarkkitchen.com", "index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

const PORT = process.env.PORT || 8000;

const privateKeyPath = path.join(__dirname, "../PossBackend/pv.key");
const certificatePath = path.join(__dirname, "../PossBackend/certificata.crt");
const caficatePath = path.join(__dirname, "../PossBackend/ca.crt");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const certificate = fs.readFileSync(certificatePath, "utf8");
const caficate = fs.readFileSync(caficatePath, "utf8");

const credentials = { key: privateKey, cert: certificate, ca: caficate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`App running on port ${PORT} using HTTPS`);
});
