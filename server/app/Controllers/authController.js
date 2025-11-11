const userDb = require("../Models/userModel");
const { hashPassword, compairePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");

exports.userRegister = async (req, res, next) => {
   try {

      const { name, email, password, phone, address, role, service_areas } = req.body;
      if (password !== req.body.confirm_password) {
         return res.status(400).json({ message: "Password and Confirm Password do not match" });
      }
      const userExists = await userDb.findOne({ $or: [{ email }, { phone }] });
      if (userExists) {
         return res.status(400).json({ message: "Email or Phone number already in use" });
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