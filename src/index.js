const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParse = require("cookie-parser");
const route = require("./routes/index.route");
const app = express();
const dotenv = require("dotenv");
const db = require("./config/db");
dotenv.config();
//Conect DB

db.connect();
app.use(bodyParser.json());

app.use(cookieParse());
//config cors for the project
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin:*");
  res.header(
    "Access-Control-Allow-Headers:Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS");
  next();
});
app.use(cors());

app.get("/cookie/set", (req, res) => {
  res.cookie("username", "minhphuc", {
    maxAge: 5 * 1000,
  });
  res.send("set cookie success");
});

app.get("/cookie/get", (req, res) => {
  const cookies = req.cookies;
  res.send(cookies);
});

// Route
route(app);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
