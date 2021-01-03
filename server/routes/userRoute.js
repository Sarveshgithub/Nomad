const express = require("express");
const jsforce = require("jsforce");
const router = express.Router();
const config = require("../config");
const oauth2 = new jsforce.OAuth2({
  loginUrl: "https://test.salesforce.com",
  clientId: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  redirectUri: config.REDIRECT,
});
function getSession(request, response) {
  console.log("trst::: session:::", request.session);
  const session = request.session;
  if (!session.sfdcAuth) {
    response.status(401).send("No active session");
    return null;
  }
  return session;
}
function resumeSalesforceConnection(session) {
  return new jsforce.Connection({
    instanceUrl: session.sfdcAuth.instanceUrl,
    accessToken: session.sfdcAuth.accessToken,
  });
}
router.get("/whoami", function (request, response) {
  const session = getSession(request, response);
  if (session == null) {
    return;
  }
  // Request session info from Salesforce
  const conn = resumeSalesforceConnection(session);
  conn.identity(function (error, res) {
    response.send({ res, instanceUrl: session.sfdcAuth.instanceUrl });
  });
});
router.get("/login", function (req, res) {
  console.log("oauth2:::", oauth2);
  res.redirect(oauth2.getAuthorizationUrl({ scope: "api id web" }));
});
router.get("/auth", function (request, response) {
  if (!request.query.code) {
    response
      .status(500)
      .send("Failed to get authorization code from server callback.");
    return;
  }
  // Authenticate with OAuth
  const conn = new jsforce.Connection({
    oauth2: oauth2,
  });
  conn.authorize(request.query.code, function (error, userInfo) {
    if (error) {
      console.log("Salesforce authorization error: " + JSON.stringify(error));
      response.status(500).json(error);
      return;
    }
    console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // Store oauth session data in server (never expose it directly to client)
    request.session.sfdcAuth = {
      instanceUrl: conn.instanceUrl,
      accessToken: conn.accessToken,
    };
    console.log("session:::", request);
    // Redirect to app main page
    return response.redirect("http://localhost:3000");
  });
});

router.post("/accounts", async (req, res) => {
  try {
    const { accessToken, instanceUrl, userId } = req.body;
    const conn = new jsforce.Connection({
      accessToken: accessToken,
      instanceUrl: instanceUrl,
    });
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

    const data = [];
    const fieldData = fieldQuery ? await conn.query(fieldQuery) : "";
    const objectData = objectQuery ? await conn.query(objectQuery) : "";

    if (fieldData.records) {
      data.push(...fieldData.records);
    }
    if (objectData.records) {
      data.push(...objectData.records);
    }
    if (data) {
      res.send(resData(data, req.body));
    } else {
      res.send("No Record Found");
    }
  } catch (err) {
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
