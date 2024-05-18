// Import necessary modules
const createToken = require("../Utils");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");

// Define a function to handle user registration
const registerUser = async (req, res) => {
    // Check if avatar file is provided
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({ success: false, message: "User Avatar Required" });
    }
    // Extract avatar file from request
    const avatar = req.files.avatar;
    // Define allowed image formats
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    // Validate avatar format
    if (!allowedFormats.includes(avatar.mimetype)) {
        return res.json({ success: false, message: "Invalid file type. Please upload avatar in png, jpg, or webp format" });
    }

    try {
        // Extract user data from request body
        const { name, email, password, role, education, phone } = req.body;
        // Validate required fields
        if (!name || !email || !password || !role || !education || !phone || !avatar) {
            return res.json({ success: false, message: "Please fill out all fields" });
        }
        // Validate name length
        if (name.length <= 3 || name.length > 32) {
            return res.json({ success: false, message: "Name must be greater than 3 characters and less than 32" });
        }
        // Validate password length
        if (password.length < 8 || password.length > 32) {
            return res.json({ success: false, message: "Password must be greater than 8 characters and less than 32" });
        }

        // Check if user is already registered
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User Already Registered!" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload avatar to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);
        // Handle Cloudinary upload errors
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log("Cloudinary error" || cloudinaryResponse.error || "Unknown Cloudinary error");
        }

        // Create a new user instance
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            education: education,
            phone: phone,
            avatar: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            }
        });

        // Save new user to the database
        const user = await newUser.save();

        // Create token for the user
        const token = createToken(user._id);
        // Set token as a cookie in the response
        res.cookie("token", token, { httpOnly: true });

        // Send token in the response
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Define a function to handle user login
const userLogin = async (req, res) => {
    // Extract email, password, and role from request body
    const { email, password, role } = req.body;
    // Validate required fields
    if (!email || !password || !role) {
        return res.json({ success: false, message: "Please fill out all fields" });
    }
    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        // If user not found, return error
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        // Check if user's role matches the specified role
        if (user.role !== role) {
            return res.json({ success: false, message: "Incorrect role" });
        }
        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        // If password doesn't match, return error
        if (!isPasswordMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Create token for the user
        const token = createToken(user._id);
        // Set token as a cookie in the response
        res.cookie("token", token, { httpOnly: true });
        // Send token in the response
        return res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

// Define a function to handle user logout
const userLogout = async (req, res) => {
    // Clear token cookie
    res.clearCookie("token", { httpOnly: true });
    // Send logout success message
    res.json({ success: true, message: "Successfully logged out!" });
};

// Define a function to get user's profile
const getMyProfile = async (req, res) => {
    // Extract user from request
    const user = req.user;
    // Send user's profile in the response
    return res.json({ success: true, user });
};

// Define a function to get all authors
const getAllAuthors = async (req, res) => {
    // Find all users with role 'Reader'
    const authors = await userModel.find({ role: "Reader" });
    // Send list of authors in the response
    return res.json({ success: true, authors: authors });
};

// Export functions for use in other modules
module.exports = { registerUser, userLogin, userLogout, getMyProfile, getAllAuthors };
