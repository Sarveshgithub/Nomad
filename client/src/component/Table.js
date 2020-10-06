import React from "react";
import Checkicon from "./Checkicon";
import Crossicon from "./Crossicon";
import ChevronDownIcon from "./ChevronDownIcon";
import ChevronRightIcon from "./ChevronRightIcon";
const RenderRow = (props) => {
  return props.keys.map((key, index) => {
    return (
      <td key={props.data["Id"] + index}>
        {typeof props.data[key] === "boolean" ? (
          props.data[key] ? (
            <Checkicon />
          ) : (
            <Crossicon />
          )
        ) : (
          props.data[key]
        )}
      </td>
    );
  });
};

function Table({ cols, data, title }) {
  const toggle = (Id) => {
    let element = document.getElementById(Id),
      style = window.getComputedStyle(element),
      display = style.getPropertyValue("display");
    console.log("display::", display);
    // console.log(
    //   "data::",
    //   data.find(({ Id }) => Id === Id)
    // );
    // data.find(({ Id }) => Id === Id).show = true;
    if (display === "none") {
      document.getElementById(Id).style.display = "block";
    } else {
      document.getElementById(Id).style.display = "none";
    }
  };
  return (
    <div>
      <h1>{title}</h1>
      {data &&
        data.map((val) => (
          <div key={val.Id}>
            <h3>
              <span onClick={() => toggle(val.Id)}>
                {val.show ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </span>
              <a
                href={
                  "https://sarvesh-sfdx-dev-ed.my.salesforce.com" + "/" + val.Id
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {val["Name"]}
              </a>
            </h3>
            <div
              id={val.Id}
              style={val.show ? "" : { display: "none", paddingLeft: "2em" }}
            >
              {val.objectPerms && (
                <div>
                  <p>
                    <u>
                      <b>Object Permession</b>
                    </u>
                  </p>
                  <table>
                    <thead>
                      <tr>
                        <th>Object</th>
                        <th>Read</th>
                        <th>Create</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>ModifyAll</th>
                        <th>ViewAll</th>
                      </tr>
                    </thead>
                    <tbody>
                      {val.objectPerms.map((field) => (
                        <tr key={field.Id}>
                          <RenderRow
                            data={field}
                            keys={[
                              "SobjectType",
                              "PermissionsRead",
                              "PermissionsCreate",
                              "PermissionsEdit",
                              "PermissionsDelete",
                              "PermissionsModifyAllRecords",
                              "PermissionsViewAllRecords",
                            ]}
                            parentId={field.Id}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {val.fieldPerms && (
                <div>
                  <p>
                    <u>
                      <b>Field Permession</b>
                    </u>
                  </p>
                  <table>
                    <thead>
                      <tr>
                        <th>SobjectType</th>
                        <th>Field</th>
                        <th>Edit</th>
                        <th>Read</th>
                      </tr>
                    </thead>
                    <tbody>
                      {val.fieldPerms.map((field) => (
                        <tr key={field.Id}>
                          <RenderRow
                            data={field}
                            keys={cols}
                            parentId={field.Id}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
export default Table;
