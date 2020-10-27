import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Outh(props) {
  const [user, setUser] = useState({
    orgType: "",
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
      console.log("sdfsdfsd");
      window.location = "/sflogin";
      // axios
      //   .get("http://localhost:5000/sflogin", user)
      //   .then((response) => {
      //     console.log("response::", response);
      //     //   props.history.push({
      //     //     pathname: "/home",
      //     //     data: response.data,
      //     //   });
      //   })
      //   .catch((error) => {
      //     console.log("error::", error.response);
      //     //   if (error) {
      //     //     const {
      //     //       response: {
      //     //         data: { message },
      //     //       },
      //     //     } = error;
      //     //     setServerError(message);
      //     //   }
      //   });
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
        </form>
      </div>
    </section>
  );
}

export default Outh;
