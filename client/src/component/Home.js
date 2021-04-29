import React, { useEffect, useState } from "react";
import { postCall } from "./util";
import Table from "./Table";
import Loader from "./Loader";
function Home(props) {
  const instanceUrl = "www.google.com";
  const [permSet, setPerms] = useState([]);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    objApi: "",
    fieldApi: "",
    userId: "",
    permName: "",
    profileName: "",
    permType: "",
    fslOLS: "",
  });
  const onchange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const validation = () => {
    const tempErr = {};
    if (!filters.permType) {
      tempErr["permType"] = "Required";
    }
    if (!filters.fslOLS) {
      tempErr["fslOLS"] = "Required";
    }
    if (!filters.fieldApi && filters.fslOLS === "FLS") {
      tempErr["fieldApi"] = "Required";
    }
    if (!filters.objApi && filters.fslOLS === "OLS") {
      tempErr["objApi"] = "Required";
    }
    return tempErr;
  };
  const submitHandler = (event) => {
    event.preventDefault();
    setError(validation());
    setIsSubmitting(true);
  };
  useEffect(() => {
    if (Object.keys(error).length === 0 && isSubmitting) {
      setLoading(true);
      callApi();
    }
  }, [error, isSubmitting]); // eslint-disable-line react-hooks/exhaustive-deps
  const callApi = () => {
    let {
      objApi,
      fieldApi,
      userId,
      permName,
      profileName,
      permType,
      fslOLS,
    } = filters;
    objApi = objApi ? `(${addQuotes(objApi)})` : null;
    fieldApi = fieldApi ? `(${addQuotes(fieldApi)})` : null;
    permName = permName ? `(${addQuotes(permName)})` : null;
    profileName = profileName ? `(${addQuotes(profileName)})` : null;
    userId = userId ? addQuotes(userId) : null;
    const callback = (response) => {
      console.log("callback response,:::", response);
      const { data, status } = response;
      if (status === 200) {
        const { permSet, profile } = data;
        if (permSet) {
          setPerms(permSet);
        }
        if (profile) {
          setProfile(profile);
        }
        if (permSet.length === 0 && profile.length === 0) {
          setServerError("No records found");
        }
      } else if (status === 500) {
        if (data.includes("Session expired or invalid")) {
          props.history.push("/signin");
        }
        setServerError(data);
      }
      setLoading(false);
    };
    postCall(
      "/api/user/fetchPermission",
      {
        objApi,
        fieldApi,
        permName,
        profileName,
        userId,
        fslOLS,
        isProfile: permType === "Profile",
        isPerm: permType === "Permission",
      },
      callback
    );
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
      <div style={{ width: "30%" }}>
        <form onSubmit={submitHandler} noValidate>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3>
              <u>Filters</u>
            </h3>
            <div>
              *Select field or object level permission
              <p>
                <label>
                  <input
                    type="radio"
                    value="FLS"
                    name="fslOLS"
                    onChange={onchange}
                  />
                  {"FLS"}
                </label>
                <label>
                  <input
                    type="radio"
                    value="OLS"
                    name="fslOLS"
                    onChange={onchange}
                  />
                  {"OLS"}
                </label>
              </p>
              {error.fslOLS && <p className="redColor">{error.fslOLS}</p>}
            </div>
            <div>
              *Select options
              <p>
                <label>
                  <input
                    type="radio"
                    name="permType"
                    value="Profile"
                    onChange={onchange}
                  />
                  {"Profile"}
                </label>
                <label>
                  <input
                    type="radio"
                    name="permType"
                    value="Permission"
                    onChange={onchange}
                  />
                  {"Permission Set"}
                </label>
              </p>
              {error.permType && <p className="redColor">{error.permType}</p>}
            </div>
            {filters.fslOLS === "OLS" && (
              <label style={{ display: "flex", flexDirection: "column" }}>
                *Enter object api names with comma seprated
                <textarea
                  type="text"
                  name="objApi"
                  value={filters.objApi}
                  onChange={onchange}
                  placeholder="Account,Contact"
                />
              </label>
            )}
            {error.objApi && <p className="redColor">{error.objApi}</p>}
            {filters.fslOLS === "FLS" && (
              <label style={{ display: "flex", flexDirection: "column" }}>
                *Enter field api names with comma seprated
                <textarea
                  type="text"
                  name="fieldApi"
                  value={filters.fieldApi}
                  onChange={onchange}
                  placeholder="Contact.Name,Contact.Email"
                />
              </label>
            )}
            {error.fieldApi && <p className="redColor">{error.fieldApi}</p>}
            {filters.permType === "Permission" && (
              <label style={{ display: "flex", flexDirection: "column" }}>
                Enter permission set names
                <textarea
                  type="text"
                  name="permName"
                  value={filters.permName}
                  onChange={onchange}
                  placeholder="Enter comma seprated permission name"
                />
              </label>
            )}
            {filters.permType === "Profile" && (
              <label style={{ display: "flex", flexDirection: "column" }}>
                Enter profile names
                <textarea
                  type="text"
                  name="profileName"
                  value={filters.profileName}
                  onChange={onchange}
                  placeholder="Enter comma seprated profile name"
                />
              </label>
            )}
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
        {serverError && (
          <div style={{ width: "100%", textAlign: "center" }}>
            {serverError}
          </div>
        )}
        {loading && <Loader />}
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
              instanceUrl={instanceUrl}
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
              instanceUrl={instanceUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
