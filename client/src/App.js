import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Signin from "./component/Signin";
import Header from "./component/Header";
import Register from "./component/Register";
import Profile from "./component/Profile";
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
          <Route path="/register" component={Register} />
          <Route path="/profile" component={Profile} />
          <Route path="/home" component={Home} />
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
