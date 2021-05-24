const jsforce = require("jsforce");
const constant = require("../constant");

const doSOQL = (req, soql) => {
  const conn = new jsforce.Connection({
    accessToken: req.session.sfdcAuth.accessToken,
    instanceUrl: req.session.sfdcAuth.instanceUrl,
  });
  const response = await conn.query(soql);
  return response;
};
const getUserPermission = (userId) => {
  return `SELECT Id, PermissionSetId FROM PermissionSetAssignment WHERE AssigneeId = ${userId}`;
};
const buildSOQL = (req) => {
  const andCondition = [],
    orCondition = [];
  const { fslOLS, objApi, fieldApi, permName, profileName, assignedPerm } = req;
  const query =
    fslOLS === "FLS"
      ? `SELECT ${constant.flsFileds.join(",")} FROM FieldPermissions`
      : fslOLS === "OLS"
      ? `SELECT ${constant.olsFileds.join(",")} FROM ObjectPermissions`
      : null;
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
  return { profile, permSet };
};
module.exports = {
  doSOQL,
  getUserPermission,
  buildSOQL,
  resData,
};
