const userDb = require("../Models/userModel");
const { hashPassword, compairePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const uploadToCloudinary = require("../Utilities/imageUpload");

exports.userRegister = async (req, res, next) => {
   try {

      console.log(req.file, "image uploaded by multer");


      const { name, email, password, phone, address, role, service_areas } = req.body;
      if (password !== req.body.confirm_password) {
         return res.status(400).json({ message: "Password and Confirm Password do not match" });
      }
      const userExists = await userDb.findOne({ $or: [{ email }, { phone }] });
      if (userExists) {
         return res.status(400).json({ message: "Email or Phone number already in use" });
      }

      let cloudinaryRes = null;
      if (req.file) {
         cloudinaryRes = await uploadToCloudinary(req.file.path,'profile-pics');
         // console.log(cloudinaryRes, "image uploaded to cloudinary");
      }

      const hasedPassword = await hashPassword(password);
      const newUser = new userDb({
         name,
         email,
         password: hasedPassword,
         phone,
         address,
         role,
         service_areas: role === "provider" ? service_areas : [],// Only set service_areas for providers   
         profile_pic: cloudinaryRes
      })
      const saved = await newUser.save();

      const savedUser = saved.toObject();
      delete savedUser.password;

      if (saved) {
         // jwt token generation
         const token = await createToken(saved._id);
         res.cookie("token", token)
         // jwt token generation

         return res.status(201).json({
            message: "User registered successfully",
            data: savedUser
         });
      }

   } catch (error) {

      // console.log("REGISTRATION ERROR:", JSON.stringify(error, null, 2));
      // return res.status(500).json({
      //    success: false,
      //    message: error.message || "Something went wrong",
      //    error
      // });

      next(error)
   }
}


/* login function*/

exports.login = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const userExists = await userDb.findOne({ email });
      if (!userExists) {
         return res.status(400).json({ error: "Invalid email" });
      }
      // password checking logic 
      const passwordMatch = await compairePassword(password, userExists.password);

      if (!passwordMatch) {
         return res.status(400).json({ error: "Invalid password" });
      }

      // jwt token generation
      const token = await createToken(userExists._id);
      res.cookie("token", token)
      // jwt token generation

      return res.status(200).json({ message: "User logged in successfully", userExists });

   } catch (error) {

      next(error)
   }
}

/* logout function*/
exports.logout = async (req, res, next) => {
   try {
      
      res.clearXCookie("token");
      res.status(200).json({ message: "User logged out successfully" });
   } catch (error) {
      next(error)
   }

}

