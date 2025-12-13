
const v1Router =  require('express').Router();
const authRouter = require('./authRoutes');
const providerRouter = require('./providerRoutes');
const userRouter = require('./userRoutes');
const adminRouter = require('./adminRoutes');
const clientRouter = require('./clientRoutes');
const areaRouter = require('./areaRoutes');
const paymentRouter = require('./paymentRoutes');


v1Router.use('/auth',authRouter);
v1Router.use('/users', userRouter); 
v1Router.use('/admin',adminRouter);
v1Router.use('/provider', providerRouter); 
v1Router.use('/client', clientRouter); 
v1Router.use('/area', areaRouter); 
v1Router.use('/payment', paymentRouter); 

module.exports = v1Router;