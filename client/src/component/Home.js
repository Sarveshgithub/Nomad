import React, { useEffect, useState } from "react";
import { postCall } from "./util";
import Table from "./Table";
function Home(props) {
  let {
    location: { data },
  } = props;
  if (!data) {
    // props.history.push("/signin");
  }

  data = {
    accessToken:
      "00D2w000003ytsa!ARMAQB8iuIdAMctP66Yha0QgVtIdSdJbCJDb7oXmANhOOmFqIXeEXqaBBysAqIwQ0wh54rdJHLVCt7Kn9_wjmp_agFeqaOM5",
    id: "0052w000002VemNAAS",
    instanceUrl: "https://sarvesh-sfdx-dev-ed.my.salesforce.com",
    organizationId: "00D2w000003ytsaEAA",
    url:
      "https://login.salesforce.com/id/00D2w000003ytsaEAA/0052w000002VemNAAS",
  };
  const [permSet, setPerms] = useState([]);
  const [profile, setProfile] = useState([]);
  const [filters, setFilters] = useState({
    objApi: "Contact",
    fieldApi: "contact.Field1__c,contact.Field2__c",
    userId: "",
    permName: "",
    profileName: "",
  });
  useEffect(() => {}, []);
  const onchange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value.replace(/\s+/g, ""),
    });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    console.log("filters:::", filters);
    let { objApi, fieldApi, userId, permName, profileName } = filters;
    objApi = objApi ? addQuotes(objApi) : "";
    fieldApi = fieldApi ? addQuotes(fieldApi) : "";
    userId = userId ? addQuotes(userId) : "";
    permName = permName ? addQuotes(permName) : "";
    profileName = profileName ? addQuotes(profileName) : "";
    console.log("objApi::", objApi, fieldApi, userId, permName, profileName);
    if (data) {
      const callback = (response) => {
        console.log("callback response,:::", response);
        if (response) {
          const { permSet, profile } = response.data;
          if (permSet) {
            setPerms(permSet);
          }
          if (profile) {
            setProfile(profile);
          }
        }
      };
      postCall(
        "/api/user/accounts",
        { objApi, fieldApi, permName, profileName, ...data },
        callback
      );
    }
  };

  const addQuotes = (data) => {
    data.split(",").forEach((element) => {
      if (element) {
        data = data.replace(element, `'${element}'`);
      }
    });
    return `(${data})`;
  };
  return (
    <div style={{ padding: "10px" }}>
      <form onSubmit={submitHandler} noValidate>
        <div style={{ display: "flex" }}>
          <label>
            Object Api Names
            <textarea
              type="text"
              name="objApi"
              value={filters.objApi}
              onChange={onchange}
              style={{ width: "100%" }}
              placeholder="Account,Contact"
            />
          </label>
          <label>
            Field Api Names
            <textarea
              type="text"
              name="fieldApi"
              value={filters.fieldApi}
              onChange={onchange}
              style={{ width: "100%" }}
              placeholder="Contact.Name,Contact.Email"
            />
          </label>
          <label>
            Permission set Names
            <textarea
              type="text"
              name="permName"
              value={filters.permName}
              onChange={onchange}
              style={{ width: "100%" }}
              placeholder="Enter comma seprated permission name"
            />
          </label>
          <label>
            Profile Names
            <textarea
              type="text"
              name="profileName"
              value={filters.profileName}
              onChange={onchange}
              style={{ width: "100%" }}
              placeholder="Enter comma seprated profile name"
            />
          </label>
          <label>
            User Id
            <textarea
              type="text"
              name="userId"
              value={filters.userId}
              onChange={onchange}
              style={{ width: "100%" }}
              placeholder="Enter salesforce user id"
            />
          </label>
          <button type="submit">Search</button>
        </div>
      </form>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div>
          {profile.length > 0 && (
            <Table
              title={"Profiles"}
              cols={[
                "SobjectType",
                "Field",
                "PermissionsEdit",
                "PermissionsRead",
              ]}
              data={profile}
              IsOwnedByProfile={true}
            />
          )}
        </div>
        <div>
          {permSet.length > 0 && (
            <Table
              title={"Permession Sets"}
              cols={[
                "SobjectType",
                "Field",
                "PermissionsEdit",
                "PermissionsRead",
              ]}
              data={permSet}
              IsOwnedByProfile={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
