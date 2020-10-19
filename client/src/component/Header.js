import React from "react";

function Header() {
  return (
    <header>
      <div>
        <h1>
          <em>SFDC Perms</em>
        </h1>
      </div>
      <div className="header-item">
        <li>About</li>
        <li>Log out</li>
      </div>
    </header>
  );
}

export default Header;
