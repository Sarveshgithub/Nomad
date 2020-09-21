import axios from "axios";
const postCall = (endPoint, body) => {
  axios
    .post(endPoint, body)
    .then((response) => {
      console.log("permession data::", response);
      const { data } = response;
      return { status: "success", data };
    })
    .catch((error) => {
      console.log(error.response);
      if (error) {
        const {
          response: {
            data: { status, message },
          },
        } = error;
        return { status: "error", message };
      }
    });
};

export { postCall };
