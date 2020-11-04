import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Signin from "./component/Signin";
import Header from "./component/Header";
import Home from "./component/Home";
function App() {
  return (
    <div>
      <Header />
      <main>
        <BrowserRouter>
          <Route path="/signin" component={Signin} />
          <Route exact path="/home" component={Home} />
          <Route path="*">
            <Redirect to="/signin" />
          </Route>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
