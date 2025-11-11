// const jwt =require('jsonwebtoken')
// const User = require('../Models/userModel');
// require('dotenv').config();

// const authMiddleware = async (req, res, next) => {
//     const token = req.cookies.token
//     if (token) {
//         try {
//             const decode = jwt.verify(token,process.env.JWT_SECRET)
//             console.log(decode);
//             // req.user=await User.findById(decode.id).select('password_hash')
//             req.user=await User.findById(decode.id)
//             next();
            
//         } catch (error) {
//             return res.status(401).json({ message: "Not authorized , token failed" })

//         }
//     } else {
//         return res.status(401).json({ message: "No token , authorization denied" })
//     }
// }

// module.exports=authMiddleware;