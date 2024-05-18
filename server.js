// Import necessary modules
const express = require("express");
const connectDb = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const expressfileupload = require("express-fileupload");
const cloudinary = require("cloudinary");

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with credentials from environment variables
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET
});

// Set the port from environment variables or default to 3000
const port = process.env.PORT || 3000;

// Create an Express application
const app = express();

// Connect to the database
connectDb();

// Middleware setup

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Enable file uploads with temporary files
app.use(expressfileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// Routes

// Mount the userRouter at the "/api/user" endpoint
app.use("/api/user", userRouter);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
