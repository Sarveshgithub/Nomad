import React from "react";
import Checkicon from "./Checkicon";
import Crossicon from "./Crossicon";
import ChevronDownIcon from "./ChevronDownIcon";
import ChevronRightIcon from "./ChevronRightIcon";
const RenderRow = (props) => {
  return props.keys.map((key, index) => {
    return (
      <td key={`${props.data["Id"]}-${index}`}>
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
    if (display === "none") {
      document.getElementById(Id).style.display = "table";
    } else {
      document.getElementById(Id).style.display = "none";
    }
  };
  return (
    <div>
      <h1>{title}</h1>
      <table>
        <tbody>
          <tr>
            {cols &&
              cols.map((val) => {
                return <th key={val}> {val} </th>;
              })}
          </tr>
          {data &&
            data.map((val) => (
              <tr key={val.Id} className="altRow">
                <td colSpan="4">
                  <h3>
                    <span onClick={() => toggle(val.Id)}>
                      {val.show ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </span>
                    <a
                      href={
                        "https://sarvesh-sfdx-dev-ed.my.salesforce.com" +
                        "/" +
                        val.Id
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {val["Name"]}
                    </a>
                  </h3>
                  <table
                    id={val.Id}
                    style={val.show ? "" : { display: "none" }}
                  >
                    <tbody>
                      {val.fieldPerms &&
                        val.fieldPerms.map((field) => (
                          <tr key={field.Id}>
                            <RenderRow data={field} keys={cols} />
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
export default Table;
