import React from "react";

function Header(props) {
  const { user } = props;
  return (
    <header
      style={{
        padding: "0 1em 0 1em",
      }}
    >
      <div>
        <h1>Nomad24</h1>
      </div>
      <div className="header-item">
        <li>
          <a
            href="https://github.com/Sarveshgithub/Nomad#readme"
            target="_blank"
            rel="noreferrer noopener"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Sarveshgithub/Nomad/issues"
            target="_blank"
            rel="noreferrer noopener"
          >
            Log Issue
          </a>
        </li>
        {user && <li>Logged In : {user.display_name}</li>}
        {user && (
          <li>
            <a
              href="https://nomad24.herokuapp.com/api/user/logout"
              rel="noreferrer noopener"
            >
              Log Out
            </a>
          </li>
        )}
      </div>
    </header>
  );
}

export default Header;
