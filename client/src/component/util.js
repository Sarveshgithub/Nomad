import axios from "axios";
const postCall = (endPoint, body, callback) => {
  axios
    .post(endPoint, body)
    .then((response) => {
      console.log("permession data::", response);
      const { data } = response;
      callback({ status: "success", data });
      //return { status: "success", data };
    })
    .catch((error) => {
      console.log(error.response);
      if (error) {
        const {
          response: {
            data: { message },
          },
        } = error;
        return { status: "error", message };
      }
    });
};

export { postCall };
