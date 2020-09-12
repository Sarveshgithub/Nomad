const express = require("express");
const { MONGODB_URL } = require("./config");
const userRoute = require("./routes/userRoute");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use("/api/user", userRoute);
app.listen(5000, () => {
  console.log("server start");
});
