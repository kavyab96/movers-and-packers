/* Admin User Management Routes*/
const adminRouter = require("express").Router();
//Updated Admin User Management Routes (with Edit Admin Profile)//

//---------------------admin -user & provider ----------------------------------//

//Admin	Get list of all users
adminRouter.get("/getUsers", (req, res) => {    
    res.send("Admin	Get list of all userst");
});

//admin update user  $ provider profile

adminRouter.put("/update/:id", (req, res) => {    
    res.send("admin update user  $ provider profile");
});


// Activate/Deactivate (is_active toggle) /soft-delete user/provider
adminRouter.put("/delete/:id", (req, res) => {    
    res.send("soft-delete user/provider");
});

//---------------------admin -provider----------------------------------//

//Approve or reject provider
adminRouter.put("/provider/verify/:id", (req, res) => {    
    res.send("Approve or reject provider");
});




//-----------------------admin prifile--------------------------//
adminRouter.get("/me", (req, res) => {    
    res.send("Get logged-in admin profile");
});

//edit admin profile
adminRouter.put("/me/", (req, res) => {    
    res.send("Update logged-in admin profile");

});

//-----------------------admin prifile--------------------------//


module.exports = adminRouter;
