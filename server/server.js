const express = require("express");
const { MONGODB_URL } = require("./config");
const userRoute = require("./routes/userRoute");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
/*****************MONGODB**********************/
/**********************************************/
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB Connected …");
  })
  .catch((error) => console.log(error));
/**********************************************/
/**********************************************/
const app = express();
app.use(bodyParser.json());
app.use("/api/users", userRoute);
app.listen(5000, () => {
  console.log("server start");
});
