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
      "00D2w000003ytsa!ARMAQAvKm6G6QXtt_nODVvZIAoBQ1.oGAdy1gv9YMAS.pb2H3DD.nGWMC6lQkL5faUZtt6BB1.WfrEs4kioz7xEH24MktaKJ",
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
    <div
      style={{
        padding: "10px",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      <div style={{ width: "20%" }}>
        <form onSubmit={submitHandler} noValidate>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              Select Options
              <p>
                <label>
                  <input type="checkbox" name="sports[]" value="cycling" />
                  {"Profile"}
                </label>
                <label>
                  <input type="checkbox" name="sports[]" value="running" />
                  {"Permession Set"}
                </label>
              </p>
            </div>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Object Api Names
              <textarea
                type="text"
                name="objApi"
                value={filters.objApi}
                onChange={onchange}
                placeholder="Account,Contact"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Field Api Names
              <textarea
                type="text"
                name="fieldApi"
                value={filters.fieldApi}
                onChange={onchange}
                placeholder="Contact.Name,Contact.Email"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Permission set Names
              <textarea
                type="text"
                name="permName"
                value={filters.permName}
                onChange={onchange}
                placeholder="Enter comma seprated permission name"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Profile Names
              <textarea
                type="text"
                name="profileName"
                value={filters.profileName}
                onChange={onchange}
                placeholder="Enter comma seprated profile name"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              User Id
              <textarea
                type="text"
                name="userId"
                value={filters.userId}
                onChange={onchange}
                placeholder="Enter salesforce user id"
              />
            </label>

            <button className="form-button" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
      <div
        style={{
          display: "flex",
          width: "80%",
          paddingLeft: "3%",
        }}
      >
        <div style={{ width: "50%" }}>
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
        <div style={{ width: "50%" }}>
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
