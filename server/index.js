const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const apiRouter = require("./app/Routes")
const { connectDB } = require("./config/db")
require("dotenv").config()
const cookeParser = require("cookie-parser")
const errorHandler = require("./app/Middleware/errorHandler")


const initSocket = require("./socket/socket");

const http = require("http");
const { Server } = require("socket.io");

const app = express()

/* ---------------- HTTP SERVER ---------------- */
const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */
// Create socket server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

/* Initialize socket logic */
initSocket(io);



/* ---------------- MIDDLEWARES ---------------- */
app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
))
app.use(express.json())//middleware to parse JSON bodies 
app.use(cookeParser())
app.use(express.urlencoded({ extended: true }))

/* ---------------- DB ---------------- */
connectDB()


/* ---------------- ROUTES ---------------- */
app.use("/api", apiRouter)

app.get("/", (req, res) => {
  res.send("hello from backend node")
})

/* ---------------- SOCKET EVENTS ---------------- */
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined room`);
//   });

//   socket.on("send_message", (data) => {
//     io.to(data.receiver_id).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// io.on("connection", (socket) => {
//   console.log(" SOCKET CONNECTED:", socket.id);

//   socket.on("send_message", async (data) => {
//     try {
//       const { conversation_id, sender_id, message } = data;
//       // 1️ Find conversation
//       const conversation = await Conversation.findById(conversation_id);
//       if (!conversation) return;
//       // 2️ Find receiver (the other participant)
//       const receiver_id = conversation.participants.find(
//         (id) => id.toString() !== sender_id
//       );
//       // 3️ Save message (NOW schema is satisfied)
//       const savedMessage = await Message.create({
//         conversation_id,
//         sender_id,
//         receiver_id,
//         message,
//       });
//       // 4️ Emit message
//       io.emit("receive_message", savedMessage);
//     } catch (err) {
//       console.error("Send message error:", err);
//     }
//   });
// });
/* ---------------- ERROR HANDLER ---------------- */
app.use(errorHandler)

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000
// app.listen(PORT,()=>{
//     console.log(`server starts on port ${PORT}`);

// })
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});