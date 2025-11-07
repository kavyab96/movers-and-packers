const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const reviewSchema = new mongoose.Schema(
  {
    service_request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },

    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewed_entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The service provider receiving the review
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review_text: {
      type: String,
      trim: true,
      default: null,
    },

    review_date: {
      type: Date,
      default: Date.now,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false } // using custom timestamps from masterSchema
);

// Add base/common fields: created_at, updated_at, updated_by, is_active
reviewSchema.add(masterSchema);

module.exports = mongoose.model("Review", reviewSchema);
