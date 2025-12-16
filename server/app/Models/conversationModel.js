// models/Conversation.js
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],

  last_message: {
    type: String
  },

  last_message_at: {
    type: Date
  },

 
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
