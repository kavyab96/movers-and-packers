const { verify } = require("jsonwebtoken");
const { adminRegister, getAllUsers ,updateAdminProfile, userDelete, verifyProvider ,adminProfile, getAllBookings } = require("../../Controllers/adminController");
const authMiddleware = require("../../Middleware/authMiddleware");
const { adminRegisterValidationRules } = require("../../Middleware/validators/authValidator");
const { addServiceAreaValidator, editServiceAreaValidator } = require("../../Middleware/validators/serviceAreaValidator");
const validate = require('../../Middleware/validators/validate');
const roleMiddleware = require("../../Middleware/roleMiddleware");
const { listServiceAreas, deleteServiceArea, editServiceArea, addServiceArea } = require("../../Controllers/serviceAreaController");

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




//-----------------------admin prifile--------------------------//
adminRouter.get("/me",authMiddleware, roleMiddleware(['admin']), adminProfile);

//edit admin profile
adminRouter.put("/me/",authMiddleware, roleMiddleware(['admin']), updateAdminProfile);

//-----------------------admin prifile--------------------------//



//---------------------admin -> maning service_areas table ----------------------------------//
adminRouter.post("/add-service-area",authMiddleware, roleMiddleware(['admin']),addServiceAreaValidator,validate, addServiceArea);
adminRouter.put("/edit-service-area/:id",authMiddleware, roleMiddleware(['admin']),editServiceAreaValidator,validate, editServiceArea);
adminRouter.put("/delete-service-area/:id",authMiddleware, roleMiddleware(['admin']), deleteServiceArea);
adminRouter.get("/list-service-areas",authMiddleware, roleMiddleware(['admin']), listServiceAreas);
//---------------------admin -> maning service_areas table ----------------------------------//


module.exports = adminRouter;
