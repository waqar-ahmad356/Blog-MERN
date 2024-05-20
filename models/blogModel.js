const mongoose = require("mongoose");
const userModel = require("./userModel");

// Define the blog schema
const blogSchema = new mongoose.Schema({
    // Title of the blog post
    title: {
        type: String,
        required: true,
        minLength: [10, "Title must contain at least 10 characters"],
        maxLength: [40, "Title cannot exceed 40 characters"],
    },
    // Main image of the blog post
    mainImage: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    // Introduction of the blog post
    intro: {
        type: String,
        required: true,
        minLength: [250, "Intro must contain at least 250 characters"],
    },
    
    // Subtitle One
    subTitlOne: {
        type: String,
        minLength: [50, "Subtitle One must contain at least 50 characters"],
    },
    // Content for Subtitle One
    subContenOne: {
        type: String,
        minLength: [250, "Subcontent One must contain at least 250 characters"],
    },
    // Image for Subtitle One
    subImageOne: {
        public_id: { type: String },
        url: { type: String },
    },
    // Subtitle Two
    subTitleTwo: {
        type: String,
        minLength: [10, "Subtitle Two must contain at least 10 characters"],
    },
    // Content for Subtitle Two
    subContenTwo: {},
    // Image for Subtitle Two
    subImageTwo: {
        public_id: { type: String },
        url: { type: String }
    },
    // Subtitle Three
    subTitleThree: {
        type: String,
        minLength: [10, "Subtitle Three must contain at least 10 characters"],
    },
    // Content for Subtitle Three
    subContenThree: {
        type: String,
        minLength: [250, "Subcontent Three must contain at least 250 characters"],
    },
    // Image for Subtitle Three
    subImageThree: {
        public_id: { type: String },
        url: { type: String }
    },
    // Category of the blog post
    category: {
        type: String,
        required: true
    },
    // Reference to the user who created the blog post
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: userModel,
        required: true
    },
    // Name of the author
    authorName: {
        type: String,
        required: true,
    },
    // Avatar of the author
    authorAvatar: {
        type: String,
        required: true,
    },
});

// Define the blog model
const blogModel = mongoose.model.blog || mongoose.model("blog", blogSchema);

// Export the blog model
module.exports = blogModel;
