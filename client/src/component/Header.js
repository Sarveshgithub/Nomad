import React from "react";

function Header() {
  console.log("routesss", window.location.pathname);
  return (
    <header>
      <div>
        <h1>
          <em>SFDC Perms</em>
        </h1>
      </div>
      {/* <div className="header-item">
        <li>Log out</li>
      </div> */}
    </header>
  );
}

export default Header;
