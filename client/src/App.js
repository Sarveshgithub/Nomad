import React, { useEffect, useState } from "react";
import Signin from "./component/Signin";
import Header from "./component/Header";
import Home from "./component/Home";
import axios from "axios";

function App() {
  const [user, serUser] = useState('test');
  useEffect(() => {
    axios
      .get("/api/user/whoami")
      .then((response) => {
        console.log("response:::", response);
        serUser(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);
  return (
    <div>
      <Header user={user} />
      <main>{user ? <Home /> : <Signin />}</main>
    </div>
  );
}
export default App;
