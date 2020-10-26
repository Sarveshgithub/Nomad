const express = require("express");
const { MONGODB_URL } = require("./server/config");
const userRoute = require("./server/routes/userRoute");
const bodyParser = require("body-parser");
const jsforce = require("jsforce");
const path = require("path");
const app = express();

app.use(bodyParser.json());
// app.use(function (req, res, next) {});
const oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl: "https://cors-anywhere.herokuapp.com/https://login.salesforce.com",
  //clientId and Secret will be provided when you create a new connected app in your SF developer account
  clientId:
    "3MVG9n_HvETGhr3AuIuvwiy4zMKg1NuqY86.pQH78QXyvdMeKkXQioAU_xnkonkzDYe2pHDAc6Z749YzGNriD",
  clientSecret:
    "118A585CF9BF43B335A2ABB3F5130D3B458E1E2072A739C1BE2613C18C001118",
  //redirectUri : 'http://localhost:' + port +'/token'
  redirectUri: "http://localhost:5000/token",
});
app.get("/sflogin", function (req, res) {
  // Redirect to Salesforce login/authorization page
  res.redirect(
    oauth2.getAuthorizationUrl({ scope: "api id web refresh_token" })
  );
});
app.get("/token", function (req, res) {
  const conn = new jsforce.Connection({ oauth2: oauth2 });
  const code = req.query.code;
  conn.authorize(code, function (err, userInfo) {
    if (err) {
      return console.error("This error is in the auth callback: " + err);
    }

    console.log("Access Token: " + conn.accessToken);
    console.log("Instance URL: " + conn.instanceUrl);
    console.log("refreshToken: " + conn.refreshToken);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    const returndata = {};
    returndata["accessToken"] = conn.accessToken;
    returndata["instanceUrl"] = conn.instanceUrl;
    returndata["refreshToken"] = conn.refreshToken;
    returndata["userInfo"] = userInfo;
    res.send(returndata);
    //res.redirect("http://localhost:5000");
  });
});
app.use("/api/user", userRoute);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server start");
});
