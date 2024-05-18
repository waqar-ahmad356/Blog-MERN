const mongoose = require("mongoose");

// Define a function to connect to the MongoDB database
const connectDb = async () => {
    try {
        // Connect to the MongoDB database using the MONGO_URL from environment variables
        await mongoose.connect(process.env.MONGO_URL)
            .then(() => {
                console.log("Database Connected");
            });
    } catch (error) {
        // If an error occurs during database connection, log the error
        console.log(error);
    }
};

// Export the connectDb function for use in other modules
module.exports = connectDb;
