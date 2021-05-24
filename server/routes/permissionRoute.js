const express = require("express");
const jsforce = require("jsforce");
const helper = require("../helper");
const router = express.Router();

router.post("/fetchPermission",(req, res) => {
  try {
    const { userId } = req.body;
    const assignedPerm = [];
    if (userId) {
      const assignedUserPerm = helper.doSOQL(
        req,
        helper.getUserPermission(userId)
      );
      if (assignedUserPerm.records) {
        assignedUserPerm.records.forEach((val) => {
          assignedPerm.push(`'${val.PermissionSetId}'`);
        });
      }
    }
    const SOQL = helper.buildSOQL({ ...req.body, assignedPerm });
    const fieldData = helper.doSOQL(req, SOQL);
    if (fieldData.records) {
      const data = [];
      data.push(...fieldData.records);
      res.send(helper.resData(data, req.body));
    } else {
      res.send("No Record Found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
module.exports = router;
