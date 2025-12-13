const paymentRouter = require("express").Router();
const { createStripeSession,verifyPayment } = require("../../Controllers/paymentController");
const authMiddleware = require("../../Middleware/authMiddleware");
const roleMiddleware = require("../../Middleware/roleMiddleware");


//Create Stripe payment session
paymentRouter.post("/create-stripe-session", authMiddleware, roleMiddleware(['user']), createStripeSession);
//verify payment
paymentRouter.post("/verify-payment", authMiddleware, roleMiddleware(['user']), verifyPayment);

module.exports = paymentRouter;
