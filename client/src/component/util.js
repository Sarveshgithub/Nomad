import axios from "axios";
const postCall = (endPoint, body, callback) => {
  axios
    .post(endPoint, body)
    .then((response) => {
      const { data, status } = response;
      callback({ status, data });
    })
    .catch((error) => {
      console.log(error.response);
      if (error) {
        const {
          response: { statusText, status },
        } = error;
        callback({ status, statusText });
      }
    });
};

export { postCall };
