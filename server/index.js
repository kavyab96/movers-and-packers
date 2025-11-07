const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")


const app =express()
// mongoose.connect("mongodb+srv://team3orisys_db_user:oubuCLQ2fNBJzFhi@cluster0.bjaluag.mongodb.net/?appName=Cluster0")
// .then(()=>{
//     console.log("connected to mongodb successfully");
// })
// .catch((err)=>{
//     console.log("error connecting to mongodb", err);
// })  


app.get("/",(req,res)=>{
  res.send("hello from backend node")
})
const PORT =5000
app.listen(PORT,()=>{
    console.log(`server starts on port ${PORT}`);
    
})