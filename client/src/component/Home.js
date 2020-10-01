import React, { useEffect, useState } from "react";
import { postCall } from "./util";
import Table from "./Table";
function Home(props) {
  let {
    location: { data },
  } = props;
  data = {
    accessToken:
      "00D2w000003ytsa!ARMAQH3.Umj2QJUV8b47rcFtAjayiZoN4ymkvSCKznxzMw4w9VW3BnVwCDkunkvfBu.sG35K3KGoB.eiAcBv3bVlclHGWY2B",
    id: "0052w000002VemNAAS",
    instanceUrl: "https://sarvesh-sfdx-dev-ed.my.salesforce.com",
    organizationId: "00D2w000003ytsaEAA",
    url:
      "https://login.salesforce.com/id/00D2w000003ytsaEAA/0052w000002VemNAAS",
  };
  const [perms, setPerms] = useState([]);
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
          setPerms(response.data);
        }
      };
      postCall(
        "/api/user/accounts",
        { objApi, fieldApi, permName, profileName, ...data },
        callback
      );
    } else {
      //props.history.push("/signin");
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
              placeholder="Enter salesforce user id"
            />
          </label>
          <button type="submit">Search</button>
        </div>
      </form>
      <h1>Welcome home</h1>
      {perms.length > 0 && (
        <Table
          cols={["SobjectType", "Field", "PermissionsEdit", "PermissionsRead"]}
          data={perms}
        />
      )}
    </div>
  );
}

export default Home;
