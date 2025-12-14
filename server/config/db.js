// const { default: mongoose } = require("mongoose")
// require('dotenv').config();

// const connectDB= async()=>{
//     try {
        
//         await mongoose.connect(process.env.Mongo_URI)
//         console.log("MongoDB connected successfully using .env");
        
//     } catch (error) {
//         console.log('MongoDB connection error',error);
        
//     }
// }

// module.exports={connectDB}

const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.Mongo_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = { connectDB };
