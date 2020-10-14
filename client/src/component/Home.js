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
      "00D2w000003ytsa!ARMAQCBrqZqMU1Zn9x8.gtBkcxpwaOYYOg7BbEygyiN1J4xVC5btCTcgByD8LRPzhXU_.eB.DdITr.DOc5hCTkFA3dEVTi6C",
    id: "0052w000002VemNAAS",
    instanceUrl: "https://sarvesh-sfdx-dev-ed.my.salesforce.com",
    organizationId: "00D2w000003ytsaEAA",
    url:
      "https://login.salesforce.com/id/00D2w000003ytsaEAA/0052w000002VemNAAS",
  };
  const [permSet, setPerms] = useState([]);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    objApi: "Contact",
    fieldApi: "contact.Field1__c,contact.Field2__c",
    userId: "",
    permName: "",
    profileName: "",
    isProfile: true,
    isPerm: false,
  });
  useEffect(() => {}, []);
  const onchange = (event) => {
    let { name, value, checked } = event.target;
    console.log("data:::", name, value, checked);
    if (checked !== undefined) {
      value = checked;
    }
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    let {
      objApi,
      fieldApi,
      userId,
      permName,
      profileName,
      isProfile,
      isPerm,
    } = filters;
    objApi = objApi ? `(${addQuotes(objApi)})` : "";
    fieldApi = fieldApi ? `(${addQuotes(fieldApi)})` : "";
    permName = permName ? `(${addQuotes(permName)})` : "";
    profileName = profileName ? `(${addQuotes(profileName)})` : "";
    userId = userId ? addQuotes(userId) : "";
    console.log("objApi::", objApi, fieldApi, userId, permName, profileName);
    if (data) {
      const callback = (response) => {
        console.log("callback response,:::", response);
        if (response) {
          setLoading(false);
          const { permSet, profile } = response.data;
          if (permSet) {
            setPerms(permSet);
          }
          if (profile) {
            setProfile(profile);
          }
        }
      };
      setLoading(true);
      postCall(
        "/api/user/accounts",
        { objApi, fieldApi, permName, profileName, isProfile, isPerm, ...data },
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
    return `${data}`;
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
            <h3>
              <u>Filters</u>
            </h3>
            <div>
              Select Options
              <p>
                <label>
                  <input
                    type="checkbox"
                    name="isProfile"
                    checked={filters.isProfile}
                    onChange={onchange}
                  />
                  {"Profile"}
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isPerm"
                    checked={filters.isPerm}
                    onChange={onchange}
                  />
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
