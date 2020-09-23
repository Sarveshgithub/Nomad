import React, { useEffect, useState } from "react";
import { postCall } from "./util";
function Home(props) {
  const {
    location: { data },
  } = props;
  const [perms, setPerms] = useState();
  const [filters, setFilters] = useState({
    objApi: "",
    fieldApi: "",
    userId: "",
    permName: "",
    profileName: "",
  });
  useEffect(() => {}, []);
  const onchange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value.replace(/\s+/g, "").split(","),
    });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    if (data) {
      const callback = (response) => {
        console.log("callback response,:::", response);
        if (response) {
          setPerms(response.data);
        }
      };
      postCall("/api/user/accounts", { ...filters, ...data }, callback);
    } else {
      //props.history.push("/signin");
    }
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
