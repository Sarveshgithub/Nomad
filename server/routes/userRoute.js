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
router.post("/accounts", async (req, res) => {
  // if auth has not been set, redirect to index
  try {
    const {
      accessToken,
      instanceUrl,
      objApi,
      fieldApi,
      permName,
      profileName,
    } = req.body;
    const andCondition = [],
      orCondition = [];
    let query =
      "SELECT Id,SobjectType,Field,ParentId,PermissionsEdit,PermissionsRead,Parent.Name,Parent.IsOwnedByProfile,Parent.ProfileId,Parent.Profile.Name FROM FieldPermissions";
    if (objApi) {
      andCondition.push(`SobjectType IN  ${objApi}`);
    }
    if (fieldApi) {
      andCondition.push(`Field IN  ${fieldApi}`);
    }
    if (permName) {
      orCondition.push(`Parent.Name IN ${permName}`);
    }
    if (profileName) {
      orCondition.push(`Parent.Profile.Name IN ${profileName}`);
    }
    query += ` WHERE ${andCondition.join(" AND ")}`;
    query += orCondition.length > 0 ? ` AND (${orCondition.join(" OR ")})` : "";
    console.log("query::", query);
    // WHERE  SobjectType IN  ('Contact') AND  Field IN  ('contact.Field1__c','contact.Field2__c','contact.Email')";
    // open connection with client's stored OAuth details
    // const objPerm =
    //   "SELECT Parent.Name,ParentId,Parent.IsOwnedByProfile,Parent.ProfileId,Parent.Profile.Name,SobjectType,PermissionsRead,PermissionsCreate,PermissionsDelete,PermissionsEdit,PermissionsViewAllRecords,PermissionsModifyAllRecords FROM ObjectPermissions WHERE SobjectType IN  ('Contact')";
    const conn = new jsforce.Connection({
      accessToken: accessToken,
      instanceUrl: instanceUrl,
    });

    const response = await conn.query(query);
    //const response1 = await conn.query(objPerm);
    const profile = [],
      permSet = [];
    if (response.records) {
      const data = response.records.reduce((r, a) => {
        let Id = a.Parent.IsOwnedByProfile ? a.Parent.ProfileId : a.ParentId,
          Name = a.Parent.IsOwnedByProfile
            ? a.Parent.Profile.Name
            : a.Parent.Name,
          ParentId = a.ParentId,
          IsOwnedByProfile = a.Parent.IsOwnedByProfile,
          d =
            r.find(({ ParentId }) => ParentId === a.ParentId) ||
            r.push({
              Id,
              Name,
              ParentId,
              IsOwnedByProfile,
              fieldPerms: [a],
              show: false,
            });
        if (d["fieldPerms"]) {
          d["fieldPerms"].push(a);
        }
        return r;
      }, []);
      data.forEach((element) => {
        element.IsOwnedByProfile
          ? profile.push(element)
          : permSet.push(element);
      });
      console.log(data.length);
      res.send({ profile, permSet });
    } else {
      res.send("No Record Found");
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).send(err.message);
  }
});
module.exports = router;
