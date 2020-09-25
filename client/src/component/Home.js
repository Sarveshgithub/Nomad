import React, { useEffect, useState } from "react";
import { postCall } from "./util";
import Checkicon from "./Checkicon";
import Crossicon from "./Crossicon";
function Home(props) {
  let {
    location: { data },
  } = props;
  data = {
    accessToken:
      "00D2w000003ytsa!ARMAQF2dvyP46LcFuFbwNOHylSD4Pd5tmoZSsWZ60TuEd4LMcOCmATItTZjPuqqahw2pR.1laH3V2axv9LuUm.fp1lkuz4Lh",
    id: "0052w000002VemNAAS",
    instanceUrl: "https://sarvesh-sfdx-dev-ed.my.salesforce.com",
    organizationId: "00D2w000003ytsaEAA",
    url:
      "https://login.salesforce.com/id/00D2w000003ytsaEAA/0052w000002VemNAAS",
  };
  const [perms, setPerms] = useState();
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
        data = data.replace(element, `\'${element}\'`);
      }
    });
    return `(${data})`;
  };

  const toggle = (Id) => {
    console.log("event", Id);
    var element = document.getElementById(Id),
      style = window.getComputedStyle(element),
      display = style.getPropertyValue("display");
    console.log("data::", display);
    // setCss({ Id, css: { display: "none" } });
    if (display == "none") {
      document.getElementById(Id).style.display = "table";
    } else {
      document.getElementById(Id).style.display = "none";
    }
    //console.log("css::", document.getElementById("myElement").style);
  };
  return (
    <div>
      <form onSubmit={submitHandler} noValidate>
        <div style={{ display: "flex" }}>
          <label>
            Object Api Names
            <input
              type="text"
              name="objApi"
              value={filters.objApi}
              onChange={onchange}
              placeholder="Account,Contact"
            />
          </label>
          <label>
            Field Api Names
            <input
              type="text"
              name="fieldApi"
              value={filters.fieldApi}
              onChange={onchange}
              placeholder="Contact.Name,Contact.Email"
            />
          </label>
          <label>
            Permission set Names
            <input
              type="text"
              name="permName"
              value={filters.permName}
              onChange={onchange}
              placeholder="Enter comma seprated permission name"
            />
          </label>
          <label>
            Profile Names
            <input
              type="text"
              name="profileName"
              value={filters.profileName}
              onChange={onchange}
              placeholder="Enter comma seprated profile name"
            />
          </label>
          <label>
            User Id
            <input
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
      <table>
        <tbody>
          <tr>
            <td>SobjectType</td>
            <td>Field</td>
            <td>PermissionsEdit</td>
            <td>PermissionsRead</td>
          </tr>
          {perms &&
            perms.map((val) => (
              <tr key={val.Id} className="altRow">
                <td colSpan="4">
                  <h3>
                    <button onClick={() => toggle(val.Id)}>Search</button>
                    <a href={data.instanceUrl + "/" + val.Id} target="_blank">
                      {val.Name}
                    </a>
                  </h3>
                  <table id={val.Id} style={{ display: "none" }}>
                    <tbody>
                      {val.fieldPerms &&
                        val.fieldPerms.map((field) => (
                          <tr key={field.Id}>
                            <td>{field.SobjectType}</td>
                            <td>{field.Field}</td>
                            <td>
                              {field.PermissionsEdit ? (
                                <Checkicon />
                              ) : (
                                <Crossicon />
                              )}
                            </td>
                            <td>
                              {field.PermissionsRead ? (
                                <Checkicon />
                              ) : (
                                <Crossicon />
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
