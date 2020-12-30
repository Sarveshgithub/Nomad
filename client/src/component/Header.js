import React from "react";

function Header() {
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
            href="https://gitreports.com/issue/Sarveshgithub/Nomad"
            target="_blank"
            rel="noreferrer noopener"
          >
            Log Issue
          </a>
        </li>
      </div>
    </header>
  );
}

export default Header;
