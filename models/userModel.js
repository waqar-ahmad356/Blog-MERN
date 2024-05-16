const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "Name must contain at least 3 characters"],
        maxLength: [32, "Name cannot exceed 32 characters"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must contain at least 8 characters"],
        maxLength: [32, "Password cannot exceed 32 characters"]
    },
    role: {
        type: String,
        required: true,
        enum: ["Author", "Reader"]
    },
    education: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
        public_id: { type: String },
        url: { type: String }
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
