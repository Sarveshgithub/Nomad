import React from "react";
import axios from "axios";
function Home(props) {
  console.log("props::", props);
  // axios
  //   .post("/api/user/permData", user)
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch((error) => {
  //     console.log(error.response);
  //     if (error) {
  //       const {
  //         response: {
  //           data: { status, message },
  //         },
  //       } = error;
  //       setServerError(message);
  //     }
  //   });
  return <h1>Welcome home</h1>;
}

export default Home;
