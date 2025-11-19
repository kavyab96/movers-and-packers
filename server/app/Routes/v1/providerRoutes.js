const providerRouter = require("express").Router();
const { getProviders , getAssignedJobs , updateJobStatus ,getKycDocuments, uploadKycDocuments } = require("../../Controllers/providerController");
const authMiddleware = require("../../Middleware/authMiddleware");
const roleMiddleware = require("../../Middleware/roleMiddleware");

//Provider-Specific Routes//


//search for providers based on service type and location and date
providerRouter.get("/get-providers",  authMiddleware,getProviders);



//Get  jobs that are pending/assigned to the logged-in provider
providerRouter.get("/jobs",authMiddleware,roleMiddleware(['provider']),getAssignedJobs );

/*edit job status (accept/reject job) ,
* trackong-status ["en-route", "arrived", "loading", "moving", "unloading", "completed"]
* update availability
*/
providerRouter.put("/update-job/:id", authMiddleware, roleMiddleware(['provider']), updateJobStatus );


//View earnings
providerRouter.get("/payments", (req, res) => {    
    res.send("provider view earnings endpoint");
});

//View uploaded KYC documents
providerRouter.get("/get-kyc-documents", authMiddleware, roleMiddleware(['provider']), getKycDocuments);

//Upload or update KYC documents
providerRouter.put("/upload-kyc-documents", authMiddleware, roleMiddleware(['provider']), uploadKycDocuments);


module.exports = providerRouter;