const jsforce = require("jsforce");
const doSOQL = (soql) => {
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
module.exports = {
  doSOQL,
  getUserPermission,
};
