const userRouter = require("express").Router();
const { getUserProfile, updateUserProfile } = require("../../Controllers/userController");
const authMiddleware = require("../../Middleware/authMiddleware");
const roleMiddleware = require("../../Middleware/roleMiddleware");
const upload = require("../../Middleware/multer");

// User Profile Routes (Client & Provider)

//Auth User	Get logged-in user profile
userRouter.get("/me", authMiddleware,roleMiddleware(['user','provider']),getUserProfile); 

//Auth User	Update own profile details
userRouter.put("/me/:id",
    authMiddleware,
    roleMiddleware(['user','provider']),
    upload.single("image"),
    updateUserProfile
); 

//



module.exports = userRouter;