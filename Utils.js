// Import the required module
const jwt = require("jsonwebtoken");

// Define a function to create a JWT token
const createToken = (id) => {
    // Generate a JWT token with the provided 'id' and the secret key from environment variables
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Export the createToken function to make it accessible from other modules
module.exports = createToken;
