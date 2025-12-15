const { verify } = require("jsonwebtoken");
const { adminRegister, getAllUsers ,updateAdminProfile,updateAdminProfilePic, userDelete, verifyProvider ,adminProfile, getAllBookings,dashboardStats,viewProviderKycdoc } = require("../../Controllers/adminController");
const authMiddleware = require("../../Middleware/authMiddleware");
const { adminRegisterValidationRules } = require("../../Middleware/validators/authValidator");
const { addServiceAreaValidator, editServiceAreaValidator } = require("../../Middleware/validators/serviceAreaValidator");
const validate = require('../../Middleware/validators/validate');
const roleMiddleware = require("../../Middleware/roleMiddleware");
const { listServiceAreas, deleteServiceArea, editServiceArea, addServiceArea } = require("../../Controllers/serviceAreaController");
const upload = require("../../Middleware/multer");

/* Admin-User Management Routes*/
const adminRouter = require("express").Router();
//Updated Admin User Management Routes (with Edit Admin Profile)//



// Register as admin    
adminRouter.post("/register",adminRegisterValidationRules, validate, adminRegister);


//---------------------admin ->user & provider ----------------------------------//

//Admin	Get list of all users
adminRouter.get("/getAllUsers",authMiddleware, roleMiddleware(['admin']),getAllUsers);

//admin get all service requests
adminRouter.get("/getAllBookings",authMiddleware, roleMiddleware(['admin']),getAllBookings);


//admin update user  $ provider profile
// adminRouter.put("/update/:id",authMiddleware, ghggh);


// Activate/Deactivate (is_active toggle) /soft-delete user/provider
adminRouter.put("/delete/:id",authMiddleware, roleMiddleware(['admin']), userDelete);

//---------------------admin ->provider----------------------------------//

//Approve or reject provider
adminRouter.put("/verify-provider/:id",authMiddleware, roleMiddleware(['admin']), verifyProvider);
/*get kyc doc for admin view*/
adminRouter.get("/provider-kyc/:id",authMiddleware, roleMiddleware(['admin']), viewProviderKycdoc);




//-----------------------admin prifile--------------------------//
// adminRouter.get("/me",authMiddleware, roleMiddleware(['admin']), adminProfile);

//edit admin profile
adminRouter.put("/me/:id",authMiddleware, roleMiddleware(['admin']), updateAdminProfile);

/* admin updation procile_pic only*/
adminRouter.put("/me/profile-pic/:id",
    authMiddleware,
    roleMiddleware(['admin']),
    upload.single("image"),
    updateAdminProfilePic
); 
//-----------------------admin prifile--------------------------//


adminRouter.get("/dashboard-stats",authMiddleware, roleMiddleware(['admin']),dashboardStats);




//---------------------admin -> maning service_areas table ----------------------------------//
adminRouter.post("/add-service-area",authMiddleware, roleMiddleware(['admin']),addServiceAreaValidator,validate, addServiceArea);
adminRouter.put("/edit-service-area/:id",authMiddleware, roleMiddleware(['admin']),editServiceAreaValidator,validate, editServiceArea);
adminRouter.put("/delete-service-area/:id",authMiddleware, roleMiddleware(['admin']), deleteServiceArea);
adminRouter.get("/list-service-areas",authMiddleware, roleMiddleware(['admin']), listServiceAreas);
//---------------------admin -> maning service_areas table ----------------------------------//


module.exports = adminRouter;
