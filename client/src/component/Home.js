import React, { useEffect, useState } from "react";
import { postCall } from "./util";
function Home(props) {
  const [perms, setPerms] = useState();
  console.log("props::", props);
  const {
    location: { data },
  } = props;
  console.log("custom data", data);
  useEffect(() => {
    if (data) {
      const response = postCall("/api/user/accounts", data);
      if (response.status == "success") {
        setPerms(response.data);
      }
    } else {
      //props.history.push("/signin");
    }
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("event:::>>>>><<<<<<>>>>>>", event);
  };
  return (
    <div>
      <form onSubmit={submitHandler} noValidate>
        <div style={{ display: "flex" }}>
          <label>
            Object Api Names
            <input
              type="text"
              name="objName"
              placeholder="Enter comma seprated object name"
            />
          </label>
          <label>
            Field Api Names
            <input
              type="text"
              name="fieldName"
              placeholder="Enter comma seprated field name"
            />
          </label>
          <label>
            Permission set Names
            <input
              type="text"
              name="permName"
              placeholder="Enter comma seprated permission name"
            />
          </label>
          <label>
            Profile Names
            <input
              type="text"
              name="proName"
              placeholder="Enter comma seprated object name"
            />
          </label>
          <label>
            User Id
            <input
              type="text"
              name="userId"
              placeholder="Enter salesforce user id"
            />
          </label>
          <button type="submit">Search</button>
        </div>
      </form>

      <h1>Welcome home</h1>
      {perms &&
        perms.map((val) => (
          <div key={val.Id}>
            <a href={data.instanceUrl + "/" + val.Id} target="_blank">
              {val.Name}
            </a>
            <table>
              <thead>
                <tr>
                  <th>SobjectType</th>
                  <th>Field</th>
                  <th>PermissionsEdit</th>
                  <th>PermissionsRead</th>
                </tr>
              </thead>
              <tbody>
                {val.fieldPerms &&
                  val.fieldPerms.map((field) => (
                    <tr key={field.Id}>
                      <td>{field.SobjectType}</td>
                      <td>{field.Field}</td>
                      <td>{`${field.PermissionsEdit}`}</td>
                      <td>{`${field.PermissionsRead}`}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}

export default Home;
