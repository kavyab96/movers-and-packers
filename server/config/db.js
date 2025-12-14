const { default: mongoose } = require("mongoose")
require('dotenv').config();

const connectDB= async()=>{
    try {
        
        await mongoose.connect(process.env.Mongo_URI)
        console.log("MongoDB connected successfully using .env");
        
    } catch (error) {
        console.log('MongoDB connection error',error);
        
    }
}

module.exports={connectDB}