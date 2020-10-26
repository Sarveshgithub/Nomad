import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Signin from "./component/Signin";
import Header from "./component/Header";
import Profile from "./component/Profile";
import Outh from "./component/Outh";
import Home from "./component/Home";
function App() {
  return (
    <div>
      <Header />
      <main>
        <BrowserRouter>
          <Route path="/signin" component={Signin} />
          <Route exact path="/">
            <Redirect to="/signin" />
          </Route>
          <Route path="/outh" component={Outh} />
          <Route path="/profile" component={Profile} />
          <Route path="/home" component={Home} />
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
