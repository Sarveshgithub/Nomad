import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Signin from "./component/Signin";
import Header from "./component/Header";
import Register from "./component/Register";
function App() {
  return (
    <div>
      <Header />
      <main>
        <BrowserRouter>
          <Route path="/signin" component={Signin} />
          <Route path="/register" component={Register} />
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
