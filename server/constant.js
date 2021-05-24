const flsFileds = [
  "Id",
  "SobjectType",
  "Field",
  "ParentId",
  "PermissionsEdit",
  "PermissionsRead",
  "Parent.Name",
  "Parent.IsOwnedByProfile",
  "Parent.ProfileId",
  "Parent.Profile.Name",
];
const olsFileds = [
  "Id",
  "Parent.Name",
  "ParentId",
  "Parent.IsOwnedByProfile",
  "Parent.ProfileId",
  "Parent.Profile.Name",
  "SobjectType",
  "PermissionsRead",
  "PermissionsCreate",
  "PermissionsDelete",
  "PermissionsEdit",
  "PermissionsViewAllRecords",
  "PermissionsModifyAllRecords",
];
module.exports = { flsFileds, olsFileds };
