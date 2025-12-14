const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const apiRouter = require("./app/Routes")
const { connectDB } = require("./config/db")
require("dotenv").config()
const cookeParser = require("cookie-parser")
const errorHandler = require("./app/Middleware/errorHandler")

const app =express()

app.use(cors(
   {
    origin: process.env.FRONTEND_URL,
    credentials:true
  }
))
app.use(express.json())//middleware to parse JSON bodies 
app.use(cookeParser())
app.use(express.urlencoded({ extended: true }))

// database connection

connectDB()
// mongoose.connect(process.env.Mongo_URI).then(()=>{
//     console.log("connected to mongoDB");
// }).catch((err)=>{
//     console.log("mongoDB connection error:",err);
// })



app.use("/api",apiRouter)



app.get("/",(req,res)=>{
  res.send("hello from backend node")
})


//errorHandler
app.use(errorHandler)

const PORT =process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server starts on port ${PORT}`);
    
})
// module.exports = app;