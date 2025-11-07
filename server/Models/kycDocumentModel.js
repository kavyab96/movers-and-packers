const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const kycDocumentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Provider uploading document
    },

    document_type: {
      type: String,
      required: true,
      trim: true,
      enum: ["aadhar", "pan", "license", "voter_id", "passport", "other"], 
      // You can modify or remove enum if you want free text
    },

    file_url: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Will be set only when admin verifies
    },

    rejection_reason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: false } // timestamps handled by masterSchema
);

// Add base fields: created_at, updated_at, updated_by, is_active
kycDocumentSchema.add(masterSchema);

module.exports = mongoose.model("KycDocument", kycDocumentSchema);
