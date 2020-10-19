const express = require("express");
const jsforce = require("jsforce");
const router = express.Router();
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
    const { accessToken, instanceUrl, userId } = req.body;
    const conn = new jsforce.Connection({
      accessToken: accessToken,
      instanceUrl: instanceUrl,
    });
    console.log("req.body:::", req.body);
    let assignedPerm = [];
    if (userId) {
      const permissionAssignment = `SELECT Id, PermissionSetId FROM PermissionSetAssignment WHERE AssigneeId = ${userId}`;
      const assignedUserPerm = permissionAssignment
        ? await conn.query(permissionAssignment)
        : "";
      if (assignedUserPerm.records) {
        assignedUserPerm.records.forEach((val) => {
          assignedPerm.push(`'${val.PermissionSetId}'`);
        });
      }
    }
    let fieldQuery = fieldSOQL({ ...req.body, assignedPerm }),
      objectQuery = objectSOQL({ ...req.body, assignedPerm });
    console.log("query::", fieldQuery);
    console.log("objectQuery:::", objectQuery);

    const data = [];
    const fieldData = fieldQuery ? await conn.query(fieldQuery) : "";
    const objectData = objectQuery ? await conn.query(objectQuery) : "";

    if (fieldData.records) {
      data.push(...fieldData.records);
    }
    if (objectData.records) {
      data.push(...objectData.records);
    }
    console.log("data:::", data);
    if (data) {
      res.send(resData(data, req.body));
    } else {
      res.send("No Record Found");
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).send(err.message);
  }
});
//Helper functions
const fieldSOQL = (req) => {
  const andCondition = [],
    orCondition = [];
  const { objApi, fieldApi, permName, profileName, assignedPerm } = req;
  let query =
    "SELECT Id,SobjectType,Field,ParentId,PermissionsEdit,PermissionsRead,Parent.Name,Parent.IsOwnedByProfile,Parent.ProfileId,Parent.Profile.Name FROM FieldPermissions";
  if (assignedPerm.length > 0) {
    andCondition.push(`ParentId IN (${assignedPerm})`);
  }
  if (objApi) {
    andCondition.push(`SobjectType IN  ${objApi}`);
  }
  if (fieldApi) {
    andCondition.push(`Field IN  ${fieldApi}`);
  } else {
    return null;
  }
  if (permName) {
    orCondition.push(`Parent.Name IN ${permName}`);
  }
  if (profileName) {
    orCondition.push(`Parent.Profile.Name IN ${profileName}`);
  }
  query += ` WHERE ${andCondition.join(" AND ")}`;
  query += orCondition.length > 0 ? ` AND (${orCondition.join(" OR ")})` : "";
  return query;
};
const objectSOQL = (req) => {
  const andCondition = [],
    orCondition = [];
  const { objApi, permName, profileName, assignedPerm } = req;
  let query =
    "SELECT Id,Parent.Name,ParentId,Parent.IsOwnedByProfile,Parent.ProfileId,Parent.Profile.Name,SobjectType,PermissionsRead,PermissionsCreate,PermissionsDelete,PermissionsEdit,PermissionsViewAllRecords,PermissionsModifyAllRecords FROM ObjectPermissions";
  if (assignedPerm.length > 0) {
    andCondition.push(`ParentId IN (${assignedPerm})`);
  }
  if (objApi) {
    andCondition.push(`SobjectType IN  ${objApi}`);
  } else {
    return null;
  }
  if (permName) {
    orCondition.push(`Parent.Name IN ${permName}`);
  }
  if (profileName) {
    orCondition.push(`Parent.Profile.Name IN ${profileName}`);
  }
  query += ` WHERE ${andCondition.join(" AND ")}`;
  query += orCondition.length > 0 ? ` AND (${orCondition.join(" OR ")})` : "";
  return query;
};
const resData = (response, params) => {
  const { isProfile, isPerm } = params;
  const profile = [],
    permSet = [];
  const data = response.reduce((r, a) => {
    let Id = a.Parent.IsOwnedByProfile ? a.Parent.ProfileId : a.ParentId,
      Name = a.Parent.IsOwnedByProfile ? a.Parent.Profile.Name : a.Parent.Name,
      ParentId = a.ParentId,
      IsOwnedByProfile = a.Parent.IsOwnedByProfile,
      d =
        r.find(({ ParentId }) => ParentId === a.ParentId) ||
        r.push({
          Id,
          Name,
          ParentId,
          IsOwnedByProfile,
          fieldPerms: !a.hasOwnProperty("PermissionsCreate") ? [a] : [],
          objectPerms: a.hasOwnProperty("PermissionsCreate") ? [a] : [],
          show: false,
        });
    if (d["fieldPerms"] && !a.hasOwnProperty("PermissionsCreate")) {
      d["fieldPerms"].push(a);
    } else if (d["objectPerms"] && a.hasOwnProperty("PermissionsCreate")) {
      d["objectPerms"].push(a);
    }
    return r;
  }, []);
  data.forEach((element) => {
    element.IsOwnedByProfile
      ? isProfile && profile.push(element)
      : isPerm && permSet.push(element);
  });
  console.log(data.length);
  return { profile, permSet };
};
module.exports = router;
