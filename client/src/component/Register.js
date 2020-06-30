import React, { useState } from "react";
import { Link } from "react-router-dom";
function Register(props) {
  const [userdetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
  });
  console.log("userdetail", userdetail);
  return (
    <section>
      <div className="wrap">
        <form className="login-form">
          <div className="form-header">
            <h3>Sign Up</h3>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Name"
              onChange={(e) =>
                setUserDetail({ ...userdetail, name: e.target.value.trim() })
              }
            />
            <span>{userdetail.name ? "Name Required field" : ""}</span>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email"
              onChange={(e) =>
                setUserDetail({ ...userdetail, email: e.target.value.trim() })
              }
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Password"
              onChange={(e) =>
                setUserDetail({
                  ...userdetail,
                  password: e.target.value.trim(),
                })
              }
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="cpassword"
              className="form-input"
              placeholder="Confirm Password"
            />
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
