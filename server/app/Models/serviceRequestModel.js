const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const serviceRequestSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Will be null until a provider accepts
    },

    service_type: {
      type: String,
      required: true,
      trim: true,
      // Optionally define allowed values if fixed types:
      // enum: ["moving", "packing", "loading", "unloading", "transport"]
    },

    requested_date_time: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
      default: "pending",
    },

    pickup_location: {
      type: String,
      required: true,
      trim: true,
    },

    dropoff_location: {
      type: String,
      default: null,
      trim: true,
    },

    area_in_square_feet: {
      type: Number,
      default: null,
    },

    estimated_cost: {
      type: Number,
      default: null,
    },

    final_cost: {
      type: Number,
      default: null,
    },

    completion_date: {
      type: Date,
      default: null,
    },

    eta: {
      // Estimated Time of Arrival of provider at pickup location
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: null,
      trim: true,
    },

    tracking_status: {
      type: String,
      default: null,
      trim: true,
      // optional: define allowed statuses for live tracking
      enum: ["en-route", "arrived", "loading", "moving", "unloading", "completed"]
    },

    cancelled_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    cancellation_reason: {
      type: String,
      default: null,
      trim: true,
    },

  },
  { timestamps: false } // We are using our own custom timestamps from masterSchema
);

// Add common master fields: created_at, updated_at, updated_by, is_active
serviceRequestSchema.add(masterSchema);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
