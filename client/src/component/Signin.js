import React from "react";
import { Link } from "react-router-dom";
function Signin() {
  return (
    <section>
      <div className="wrap">
        <form className="login-form">
          <div className="form-header">
            <h3>Login</h3>
          </div>
          <div className="form-group">
            <input type="text" className="form-input" placeholder="Email" />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
            />
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
