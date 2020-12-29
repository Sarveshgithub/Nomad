import React, { useState } from "react";
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

function Table({ cols, data, title, instanceUrl }) {
  const toggle = (Id) => {
    let element = document.querySelectorAll("[id=" + `'${Id}'` + "]");
    element.forEach((val) => {
      let style = window.getComputedStyle(val),
        display = style.getPropertyValue("display");
      if (display === "none") {
        val.style.display = "block";
      } else {
        val.style.display = "none";
      }
    });
  };
  return (
    <div>
      <h1>{title}</h1>
      {data &&
        data.map((val) => (
          <div key={val.Id}>
            <div style={{ display: "flex" }}>
              <span onClick={() => toggle(val.Id)}>
                <div id={val.Id} style={{ display: "none" }}>
                  <ChevronDownIcon />
                </div>

                <div id={val.Id} style={{ display: "block" }}>
                  <ChevronRightIcon />
                </div>
              </span>
              <h3>
                <a
                  href={instanceUrl + "/" + val.Id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {val["Name"]}
                </a>
              </h3>
            </div>
            <div
              id={val.Id}
              style={val.show ? "" : { display: "none", paddingLeft: "2em" }}
            >
              {val.objectPerms.length > 0 && (
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
              {val.fieldPerms.length > 0 && (
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
