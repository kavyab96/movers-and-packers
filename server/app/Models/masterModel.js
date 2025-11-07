const mongoose = require("mongoose")

const masterSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
   is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: false })  

// Auto-update `updated_at` whenever the document is saved
masterSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Auto-update `updated_at` for update operations
masterSchema.pre([ "updateOne", "findOneAndUpdate","updateMany"], function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

module.exports = masterSchema;