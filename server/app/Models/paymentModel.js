const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const paymentSchema = new mongoose.Schema(
  {
    service_request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },

    paid_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paid_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    payment_method: {
      type: String,
      required: true,
      trim: true,
      enum: ["upi", "card", "netbanking", "paypal", "wallet", "cod", "other"],
      default: "upi",
    },

    payment_gateway: {
      type: String,
      default: null,
      trim: true,
      // Example values: "Razorpay", "Stripe", "PayPal", etc.
    },

    invoice_link: {
      type: String,
      default: null,
      trim: true,
    },

    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    payment_date: {
      type: Date,
      default: null, // Set when payment is successfully completed
    },
  },
  { timestamps: false } // using custom timestamps from masterSchema
);

// Add common master fields: created_at, updated_at, updated_by, is_active
paymentSchema.add(masterSchema);

module.exports = mongoose.model("Payment", paymentSchema);
