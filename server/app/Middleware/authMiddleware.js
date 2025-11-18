const jwt = require('jsonwebtoken')
const User = require('../Models/userModel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {

        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "No token , authorization denied" })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if (!decode) {
            return res.status(401).json({ error: "Token is not valid" })
        }
        // console.log(decode);
        // req.user=await User.findById(decode.id).select('password_hash')
        req.user = await User.findById(decode.id)
        next();



    } catch (error) {
        res.status(error.status || 401).json({ error: error.message || "Authorization failed" })
    }
}

module.exports = authMiddleware;