const v1Router =  require('express').Router();
const userRoutes = require('./userRoutes');

v1Router.use('/user', userRoutes); 
module.exports = v1Router;