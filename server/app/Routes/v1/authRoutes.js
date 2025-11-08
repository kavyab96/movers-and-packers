const authRouter = require("express").Router();
// Routes for User Module (Client + Provider + Admin)//



// Register as user or provider
authRouter.post("/register", (req, res) => {    
    res.send("User registration endpoint");
});


//Login with email & password
authRouter.post("/login", (req, res) => {    
    res.send("User login endpoint");
}); 

//Logout user
authRouter.post("/logout", (req, res) => {    
    res.send("User logout endpoint");
}); 

//reset password
authRouter.post("/reset-password", (req, res) => {    
    res.send("Password reset endpoint");
});



module.exports = authRouter;