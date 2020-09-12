const express = require("express");
const jsforce = require("jsforce");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    console.log("response:::", req.body);
    const { userName, password, token } = req.body;
    const conn = new jsforce.Connection({
      loginUrl: "https://login.salesforce.com",
    });
    const response = await conn.login(userName, password + token);
    response["accessToken"] = conn.accessToken;
    response["instanceUrl"] = conn.instanceUrl;
    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
module.exports = router;
