const providerRouter = require("express").Router();
const { getPayments } = require("../../Controllers/paymentController");
const { getProviders, getAssignedJobs, updateJobStatus } = require("../../Controllers/providerController");
const { getKycDocuments,uploadKycDocuments } = require("../../Controllers/kycDocumentController");
const authMiddleware = require("../../Middleware/authMiddleware");
const roleMiddleware = require("../../Middleware/roleMiddleware");
const upload = require("../../Middleware/multer");

//Provider-Specific Routes//


//search for providers based on service type and location and date
providerRouter.get("/get-providers", authMiddleware, getProviders);



//Get  jobs that are pending/assigned to the logged-in provider
providerRouter.get("/jobs", authMiddleware, roleMiddleware(['provider']), getAssignedJobs);

/*edit job status (accept/reject job) ,
* trackong-status ["en-route", "arrived", "loading", "moving", "unloading", "completed"]
* update availability
*/
providerRouter.put("/update-job/:id", authMiddleware, roleMiddleware(['provider']), updateJobStatus);


//View earnings***********
providerRouter.get("/get-payments", authMiddleware, roleMiddleware(['provider']), getPayments);

//View uploaded KYC documents
providerRouter.get("/get-kyc-documents", authMiddleware, roleMiddleware(['provider']), getKycDocuments);

//Upload or update KYC documents
providerRouter.post("/upload-kyc-documents",
    authMiddleware,
    roleMiddleware(['provider']),
    upload.single("doc"),
    uploadKycDocuments);




module.exports = providerRouter;