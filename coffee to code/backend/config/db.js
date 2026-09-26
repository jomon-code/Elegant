const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('ℹ️  No MONGODB_URI specified. Running in in-memory demo mode.');
    return null;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // For demo purposes, continue without DB
    console.log('Running in demo mode without persistent database');
  }
};

module.exports = connectDB;
