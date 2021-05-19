import axios from "axios";
const postCall = (endPoint, body, callback) => {
  axios
    .post(endPoint, body)
    .then((response) => {
      const { data, status } = response;
      callback({ status, data });
    })
    .catch((error) => {
      if (error) {
        const {
          response: { data, status },
        } = error;
        callback({ status, data });
      }
    });
};

export { postCall };
