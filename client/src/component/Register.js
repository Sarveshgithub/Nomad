import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Register(props) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpass: "",
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

    if (!user.name) {
      tempErr["name"] = "Required";
    }
    if (!user.email) {
      tempErr["email"] = "Required";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)
    ) {
      tempErr["email"] = "Invalid Email";
    }
    if (!user.password) {
      tempErr["password"] = "Required";
    } else if (user.password.length < 6) {
      tempErr["password"] = "Password must be 6 character";
    }
    if (!user.cpass) {
      tempErr["cpass"] = "Required";
    } else if (user.password !== user.cpass) {
      tempErr["cpass"] = "Password not matched";
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
      registerUser();
    }
  }, [error]);

  const registerUser = () => {
    console.log("test::", user);
    axios
      .post("/api/users/register", user)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
        if (error) {
          const {
            response: {
              data: { status, message },
            },
          } = error;
          if (status === "error") {
            setServerError(message);
          }
          console.log(status);
          console.log(message);
        }
      });
    console.log("register user");
  };
  return (
    <section>
      <div className="wrap">
        <form className="login-form" onSubmit={submitHandler} noValidate>
          <div className="form-header">
            <h3>Sign Up</h3>
            {serverError && <p className="redColor">{serverError}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Name"
              value={user.name}
              onChange={onchange}
            />
            {error.name && <p className="redColor">{error.name}</p>}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email"
              value={user.email}
              onChange={onchange}
            />
            {error.email && <p className="redColor">{error.email}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Password"
              value={user.password}
              onChange={onchange}
            />
            {error.password && <p className="redColor">{error.password}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="cpass"
              className="form-input"
              placeholder="Confirm Password"
              value={user.cpass}
              onChange={onchange}
            />
            {error.cpass && <p className="redColor">{error.cpass}</p>}
          </div>
          <div className="form-group">
            <button className="form-button" type="submit">
              Singn up
            </button>
          </div>
          <div className="form-footer">
            Already have an account?<Link to="/signin">Sign in</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
