const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const serviceAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      default: null,
      trim: true,
    },

    state: {
      type: String,
      default: null,
      trim: true,
    },

    country: {
      type: String,
      default: null,
      trim: true,
    },

    // Can be single pincode or multiple pincodes
    postal_code: {
      type: [String], // Array of pin codes
      default: [],
    },
  },
  { timestamps: false } // We are using our own custom timestamps from masterSchema
);

// Add common master fields: created_at, updated_at, updated_by, is_active
serviceAreaSchema.add(masterSchema);

module.exports = mongoose.model("Area", serviceAreaSchema);
