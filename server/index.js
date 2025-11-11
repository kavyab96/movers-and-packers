const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const apiRouter = require("./app/Routes")
const { connectDB } = require("./config/db")
require("dotenv").config()
const cookeParser = require("cookie-parser")

const app =express()

app.use(cors())
app.use(express.json())//middleware to parse JSON bodies 
app.use(cookeParser())

// database connection

connectDB()

app.use("/api",apiRouter)



app.get("/",(req,res)=>{
  res.send("hello from backend node")
})
const PORT =process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server starts on port ${PORT}`);
    
})