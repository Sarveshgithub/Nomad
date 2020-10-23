import React from "react";
import loaderImg from "../asset/img/2.gif";

function Loader(props) {
  return (
    <div className="loader-container">
      <div className="loader">
        <img src={loaderImg} alt="Loader"></img>
      </div>
    </div>
  );
}

export default Loader;
