const express = require("express");
const { registerUser, userLogin, userLogout, getMyProfile, getAllAuthors } = require("../controllers/usercontroller");
const { isAuthenticated, isAuthorized } = require("../middleware/auth");

// Create an Express Router instance
const userRouter = express.Router();

// Define routes for user operations

// Route for user registration
userRouter.post("/register", registerUser);

// Route for user login
userRouter.post("/login", userLogin);

// Route for user logout
userRouter.post("/logout", userLogout);

// Route for getting user's own profile
// Requires authentication using isAuthenticated middleware
userRouter.get("/myprofile", isAuthenticated, getMyProfile);

// Route for getting all authors
// Does not require authentication or authorization
userRouter.get("/authors", getAllAuthors);

// Export the userRouter for use in other modules
module.exports = userRouter;
