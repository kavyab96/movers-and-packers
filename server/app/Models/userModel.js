const mongoose = require("mongoose")
const masterSchema = require("./masterModel")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: function () {
            return this.role !== "admin";
        },
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: function () {
            return this.role !== "admin";
        },
        trim: true
    },
    registration_date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["user", "provider", "admin"],
        required: true,
        default: "user"
    },
    verification_status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: function () {
            return this.role === "provider" ? "pending" : null;
        },
    },
    availability_status: {
        type: String,
        enum: ["active", "on-duty", "off-duty"],
        required: function () {
            return this.role === "provider";
        },
        default: this.role === "provider" ? "active" : null,
    },

    service_areas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Area",
            required: function () {
                return this.role === "provider";
            },
        }
    ],

    profile_pic: {
        type: String,
        default: null,
    },

    // ...masterSchema.obj // inherit master schema fields
}, { timestamps: false })
userSchema.add(masterSchema);// Merging masterSchema fields into userSchema

module.exports = mongoose.model("User", userSchema)
