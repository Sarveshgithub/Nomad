// Username: sarvesh.kumar@sfdx.com
// Security token (case-sensitive): As0Iba7gK2T9sqzdE7CZRh1rn
// password : Code@123
import React, { useState, useEffect } from "react";
function Signin(props) {
  const [user, setUser] = useState({
    orgType: "",
  });
  const [error, setError] = useState({});
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
      window.location = `http://localhost:5000/api/user/login?orgType=${user.orgType}`;
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [error, isSubmitting, user, props.history]);
  return (
    <section>
      <div className="wrap">
        <form className="login-form" onSubmit={submitHandler} noValidate>
          <div className="form-header">
            <h3>Login</h3>
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

export default Signin;
