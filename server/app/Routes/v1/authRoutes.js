const authRouter = require("express").Router();
// Routes for User Module (Client + Provider + Admin)//
const {userRegister,login,logout,resetPassword }= require('../../Controllers/authController');
const {registerValidationRules,loginValidationRules}= require('../../Middleware/validators/authValidator');
const validate = require('../../Middleware/validators/validate');
const upload = require("../../Middleware/multer");


// Register as user or provider
authRouter.post("/register", upload.single("image"), registerValidationRules, validate, userRegister);


//Login with email & password
authRouter.post("/login",loginValidationRules,validate, login); 

//Logout user
authRouter.post("/logout", logout); 

//reset password
authRouter.post("/reset-password", resetPassword);



module.exports = authRouter;