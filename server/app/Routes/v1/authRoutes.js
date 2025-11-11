const authRouter = require("express").Router();
// Routes for User Module (Client + Provider + Admin)//
const {userRegister,login }= require('../../Controllers/authController');
const {registerValidationRules,loginValidationRules}= require('../../Middleware/validators/authValidator');
const validate = require('../../Middleware/validators/validate');


// Register as user or provider
authRouter.post("/register",registerValidationRules, validate, userRegister);
// Register as admin    
authRouter.post("/admin/register", (req, res) => {    
    res.send("User registration endpoint");
});


//Login with email & password
authRouter.post("/login",loginValidationRules,validate, login); 

//Logout user
authRouter.post("/logout", (req, res) => {    
    res.send("User logout endpoint");
}); 

//reset password
authRouter.post("/reset-password", (req, res) => {    
    res.send("Password reset endpoint");
});



module.exports = authRouter;