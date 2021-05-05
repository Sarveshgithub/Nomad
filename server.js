const express = require("express");
const userRoute = require("./server/routes/userRoute");
const session = require("express-session");
const path = require("path");
const app = express();
const config = require("./server/config");
const port = process.env.PORT || 5000;
app.use(
  session({
    secret: "test123",
    cookie: { secure: config.HTTP == "true" },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());

app.use("/api/user", userRoute);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("server started port::::", port);
});
