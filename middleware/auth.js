const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Authentication middleware
const isAuthenticated = async (req, res, next) => {
    // Extract the token from the request cookies
    const { token } = req.cookies;
    // If token is not present, user is not authenticated
    if (!token) {
        res.json({ success: false, message: "User is not authenticated" });
    }
    try {
        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user in the database using the decoded user ID
        req.user = await userModel.findById(decoded.id);
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token verification fails, return an error
        res.json({ success: false, message: "Invalid token" });
    }
};

// Authorization middleware
const isAuthorized = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            // If user's role is not allowed, return an error
            return res.json({ success: false, message: `User with role ${req.user.role} is not allowed to access this resource` });
        }
        // Proceed to the next middleware or route handler
        next();
    };
};

// Export the middleware functions for use in other modules
module.exports = { isAuthenticated, isAuthorized };
