const userRouter = require("express").Router();

// User Profile Routes (Client & Provider)

//Auth User	Get logged-in user profile
userRouter.get("/me", (req, res) => {    
    res.send("Auth User	Get logged-in user profile");
}); 

//Auth User	Update own profile details
userRouter.put("/me/:id", (req, res) => {    
    res.send("Auth User	Get logged-in user profile");
}); 

//



module.exports = userRouter;