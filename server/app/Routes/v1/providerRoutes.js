const providerRouter = require("express").Router();

//Provider-Specific Routes//



//Get assigned jobs
providerRouter.get("/jobs", (req, res) => {    
    res.send("provider get assigned jobs endpoint");
});

/*edit job status (accept/reject job) ,
* trackong-status ["en-route", "arrived", "loading", "moving", "unloading", "completed"]
* update availability
*/
providerRouter.put("/update-job/:id", (req, res) => {    
    res.send("provider accept/reject job endpoint");
});


//View earnings
providerRouter.get("/payments", (req, res) => {    
    res.send("provider view earnings endpoint");
});

//View uploaded KYC documents
providerRouter.get("/kyc-documents", (req, res) => {    
    res.send("provider view uploaded KYC documents endpoint");
});

//Upload or update KYC documents
// providerRouter.put("/kyc-documents", (req, res) => {    
//     res.send("provider upload or update KYC documents endpoint");
// });


module.exports = providerRouter;