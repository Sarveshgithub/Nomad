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

function Table({ cols, data }) {
  console.log("cols::", cols);
  console.log("data::", data);
  const toggle = (Id) => {
    console.log("event", Id);
    var element = document.getElementById(Id),
      style = window.getComputedStyle(element),
      display = style.getPropertyValue("display");
    console.log("data::", display);
    // setCss({ Id, css: { display: "none" } });
    if (display === "none") {
      document.getElementById(Id).style.display = "table";
    } else {
      document.getElementById(Id).style.display = "none";
    }
    // if (show.id == Id && show.show) {
    //   setTable({ id: "", show: false });
    // } else {
    //   setTable({ id: Id, show: true });
    // }
    // perms.find((val) => {
    //   if (Id === val.Id) {
    //     val.show = !val.show;
    //   }
    // });
    // let newData = perms;
  };
  return (
    <table>
      <tbody>
        <tr>
          {cols &&
            cols.map((val) => {
              return <td key={val}> {val} </td>;
            })}
        </tr>
        {data &&
          data.map((val) => (
            <tr key={val.Id} className="altRow">
              <td colSpan="4">
                <h3>
                  <span onClick={() => toggle(val.Id)}>
                    {`${val.show}`}
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
                <table id={val.Id} style={val.show ? "" : { display: "none" }}>
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
  );
}
export default Table;
