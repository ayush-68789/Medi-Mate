const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    
    if (!uri) {
      console.error('Error: MONGODB_URL is not defined in environment variables.');
      console.error('Check your Render Dashboard and ensure the variable key is exactly "MONGODB_URL".');
      process.exit(1);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('MongoDB Auth Error: The credentials provided in MONGODB_URL are incorrect.');
      console.error('Please check your Render environment variables and ensure the password is URL-encoded if it contains special characters.');
    } else {
      console.error(`MongoDB Connection Error: ${error.message}`);
    }
    process.exit(1);
  }
};


module.exports = connectDB;