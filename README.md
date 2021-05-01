# [Nomad](https://nomad24.herokuapp.com/)
## About
Nomad is a open source application which help to retrive Salesforce standards and custom objects and fields permession based on profiels and permession sets, Faciliate with sandbox and production ready.

## Feature 
- Easy to login Sandbox or Production via outh2.0
- Retrive custom and standard FLS and OLS permession
- Easy to navigate permession set and profile in Org from Nomad, just need to click on permession name
> Note:
 [Special Properties for Field Permissions](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_fieldpermissions.htm).
 Field Permissions won't show system fields that Salesforce sets access, you will get No Records. ```i.e. Name, Id, CreatedById,CreatedDate```

## Tech
- ### Frontend
    Frontend is build on [React](https://reactjs.org/), which is open source JS library for building user interfaces.
- ### Backend
    Backend build on express.js
     - **User Login** - Using JSForce [OAuth2](https://jsforce.github.io/document/#oauth2) with connected app
     - **Query** - Using [SOQL](https://jsforce.github.io/document/#query) to get the records
        #### Example
        ```
        var records = [];
        conn.query("SELECT Id, Name FROM Account", function(err, result) {
        if (err) { return console.error(err); }
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length);
        });
        ```
## Want to contribute? Great!
Create Pull Request to ```master``` with your feature banch, I will review and merge the changes.