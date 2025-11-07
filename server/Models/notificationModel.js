const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const notificationSchema = new mongoose.Schema(
  {
    service_request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      default: null, // Some notifications may not be linked to a service request
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

    message_status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },

    timestamp: {
      type: Date,
      default: Date.now, // When notification was triggered
    },
  },
  { timestamps: false } // custom timestamps handled by masterSchema
);

// Add common base fields: created_at, updated_at, updated_by, is_active
notificationSchema.add(masterSchema);

module.exports = mongoose.model("Notification", notificationSchema);
