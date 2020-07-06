const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

router.post("/signin", async (req, res) => {
  const signinUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (signinUser) {
  } else {
    res.status(401).send({ message: "Invalid Email or Password." });
  }
});

router.post("/register", async (req, res) => {
  console.log("req::", req.body);
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .send({ status: "error", message: "That user already exisits!" });
  } else {
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      const newUser = await user.save();
      if (newUser) {
        res.send({
          status: "success",
          response: {
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        });
      } else {
        res
          .status(401)
          .send({ status: "error", message: "Invalid User Data." });
      }
    } catch (error) {
      res.send({ message: error.message });
    }
  }
});

module.exports = router;
