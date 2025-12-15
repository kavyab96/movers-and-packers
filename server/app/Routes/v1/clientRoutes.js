// ONLY for client-related actions
const { addReview } = require("../../Controllers/reviewController");
const { createBooking,getBookings, bookingDetails, cancelBooking ,calculateCost } = require("../../Controllers/serviceRequestController");
const { dashboardStats } = require("../../Controllers/userController");
const authMiddleware = require("../../Middleware/authMiddleware");
const roleMiddleware = require("../../Middleware/roleMiddleware");
const { reviewValidator } = require("../../Middleware/validators/reviewValidator");
const { createBookingValidator } = require("../../Middleware/validators/serviceRequestValidator");
const validate = require("../../Middleware/validators/validate");
const { add } = require("../../Models/masterModel");
const clientRouter = require("express").Router();


//Create a booking request
clientRouter.post("/create-booking",authMiddleware,roleMiddleware(['user']),createBookingValidator,validate, createBooking );

//Get list of  own booking requests
clientRouter.get("/bookings", authMiddleware,roleMiddleware(['user']),getBookings );

//View booking details
clientRouter.get("/booking-detail/:id",authMiddleware,roleMiddleware(['user']),bookingDetails );


//Cancel a booking
clientRouter.put("/cancel-booking/:id", authMiddleware,roleMiddleware(['user']), cancelBooking);


//client adds review, after completion
clientRouter.post("/add-review/:providerId", authMiddleware,roleMiddleware(['user']),reviewValidator,validate,addReview);

//calculate distance_in_km and estimated cost when user select pickup and dropoff locations
clientRouter.post("/calculate-cost/",authMiddleware,roleMiddleware(['user']),calculateCost );

clientRouter.get("/dashboard-stats",authMiddleware, roleMiddleware(['user']),dashboardStats);


module.exports = clientRouter;