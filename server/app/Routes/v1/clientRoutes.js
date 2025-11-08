// ONLY for client-related actions
const clientRouter = require("express").Router();



//Create a booking request
clientRouter.post("/create-booking", (req, res) => {    
    res.send("client create booking request endpoint");
});

//Get own booking requests
clientRouter.get("/bookings", (req, res) => {    
    res.send("client get own booking requests endpoint");
});

//View booking details
clientRouter.get("/booking/:id", (req, res) => {    
    res.send("client view booking details endpoint");
});
//Cancel a booking
clientRouter.put("/cancel-booking/:id", (req, res) => {    
    res.send("client cancel a booking endpoint");
});


//search for providers based on service type and location and date
clientRouter.get("/get-providers", (req, res) => {    
    res.send("client search for providers endpoint");
});


//Add review after completion

clientRouter.post("/add-review/:providerId", (req, res) => {    
    res.send("client add review after completion endpoint");
});


module.exports = clientRouter;