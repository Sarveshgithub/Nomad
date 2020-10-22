const express = require("express");
const { MONGODB_URL } = require("./config");
const userRoute = require("./routes/userRoute");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(bodyParser.json());
app.use("/api/user", userRoute);
app.use(express.static(path.join(__dirname, "../build")));
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server start");
});
