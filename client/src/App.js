import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Signin from "./component/Signin";
import Header from "./component/Header";
import Home from "./component/Home";
import axios from "axios";

function App() {
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    axios
      .get("/api/user/whoami")
      .then((response) => {
        console.log("response:::", response);
      })
      .catch((error) => {
        console.log(error.response);
        if (error) {
          const {
            response: { data },
          } = error;
          setServerError(data);
        }
      });
  }, []);
  return (
    <div>
      <Header />
      <main>{!serverError ? <Signin /> : <Home />}</main>
    </div>
  );
}
// <p className="redColor">{serverError}</p>
export default App;
