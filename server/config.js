const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  SECRET: process.env.SECRET,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT: process.env.REDIRECT,
};
