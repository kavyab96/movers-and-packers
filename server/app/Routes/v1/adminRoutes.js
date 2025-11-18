const { verify } = require("jsonwebtoken");
const { adminRegister, getAllUsers ,updateAdminProfile, userDelete, verifyProvider ,adminProfile } = require("../../Controllers/adminController");
const authMiddleware = require("../../Middleware/authMiddleware");
const { adminRegisterValidationRules } = require("../../Middleware/validators/authValidator");
const validate = require('../../Middleware/validators/validate');
const roleMiddleware = require("../../Middleware/roleMiddleware");

/* Admin-User Management Routes*/
const adminRouter = require("express").Router();
//Updated Admin User Management Routes (with Edit Admin Profile)//



// Register as admin    
adminRouter.post("/register",adminRegisterValidationRules, validate, adminRegister);


//---------------------admin ->user & provider ----------------------------------//

//Admin	Get list of all users
adminRouter.get("/getAllUsers",authMiddleware, roleMiddleware(['admin']),getAllUsers);

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


module.exports = adminRouter;
