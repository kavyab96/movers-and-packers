const userRouter = require("express").Router();
// const userController = require("../../Controllers/v1/userController");

userRouter.post("/register", (req, res) => {    
    res.send("User registration endpoint");
});

userRouter.post("/login", (req, res) => {    
    res.send("User login endpoint");
}); 

module.exports = userRouter;