import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Signin(props) {
  const [user, setUser] = useState({
    userName: "sarvesh.kumar@sfdx.com",
    password: "Test@123",
    secToken: "Tc3h1ugWjT9agONYCHfSPy9y",
    orgType: "https://login.salesforce.com",
  });
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onchange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const validation = () => {
    const tempErr = {};
    if (!user.userName) {
      tempErr["userName"] = "Required";
    }
    if (!user.password) {
      tempErr["password"] = "Required";
    }
    if (!user.secToken) {
      tempErr["secToken"] = "Required";
    }
    if (!user.orgType) {
      tempErr["orgType"] = "Required";
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
      console.log("test::", user);
      axios
        .post("/api/user/login", user)
        .then((response) => {
          console.log(response);
          props.history.push({
            pathname: "/home",
            data: response.data,
          });
        })
        .catch((error) => {
          console.log(error.response);
          if (error) {
            const {
              response: {
                data: { message },
              },
            } = error;
            setServerError(message);
          }
        });
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [error, isSubmitting, user, props.history]);
  return (
    <section>
      <div className="wrap">
        <form className="login-form" onSubmit={submitHandler} noValidate>
          <div className="form-header">
            <h3>Login</h3>
            {serverError && <p className="redColor">{serverError}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              name="userName"
              value={user.userName}
              onChange={onchange}
              placeholder="UserName"
            />
            {error.userName && <p className="redColor">{error.userName}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={onchange}
            />
            {error.password && <p className="redColor">{error.password}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Security Token"
              name="secToken"
              value={user.secToken}
              onChange={onchange}
            />
            {error.secToken && <p className="redColor">{error.secToken}</p>}
          </div>
          <div className="form-group">
            <input
              type="radio"
              value="https://login.salesforce.com"
              name="orgType"
              onChange={onchange}
            />
            {"Production"}
            <input
              type="radio"
              value="https://test.salesforce.com"
              name="gender"
              name="orgType"
              onChange={onchange}
            />
            {"Sandbox"}
            {error.orgType && <p className="redColor">{error.orgType}</p>}
          </div>
          <div className="form-group">
            <button className="form-button" type="submit">
              Login
            </button>
          </div>
          <div className="form-footer">
            Don't have an account?<Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Signin;
