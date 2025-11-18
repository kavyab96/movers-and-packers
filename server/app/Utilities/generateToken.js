require("dotenv").config()
const jwt = require('jsonwebtoken');
maxAge = 3 * 24 * 60 * 60; // 3 days in seconds


const createToken = (id,role='user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {expiresIn: maxAge});
};

module.exports = {createToken};