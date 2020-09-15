const express = require("express");
const jsforce = require("jsforce");
const router = express.Router();
// const username = "sarvesh.kumar@sfdx.com";
// const password = "Apple@123";
// const token = "6LnwuvlLTfrE5gnaEe5UYK6PJ";
router.post("/login", async (req, res) => {
  try {
    console.log("response:::", req.body);
    const { userName, password, secToken, orgType } = req.body;
    const conn = new jsforce.Connection({
      loginUrl: orgType,
    });
    const response = await conn.login(userName, password + secToken);
    response["accessToken"] = conn.accessToken;
    response["instanceUrl"] = conn.instanceUrl;
    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
module.exports = router;
