const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const messageSchema = new mongoose.Schema(
  {
    // service_request_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ServiceRequest",
    //   required: true, // Message must belong to a job chat
    // },
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },

    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    message_type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
      // system messages: "Booking Accepted", "Provider is on the way", etc.
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: false } // Using custom timestamps from masterSchema
);

// Add common base fields: created_at, updated_at, updated_by, is_active
messageSchema.add(masterSchema);

module.exports = mongoose.model("Message", messageSchema);
