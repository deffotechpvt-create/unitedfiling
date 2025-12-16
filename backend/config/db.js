const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Performance optimizations
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection pool size for better concurrency
      maxPoolSize: 10,
      minPoolSize: 2,
      
      // Connection timeout settings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Auto index in production should be false for performance
      autoIndex: process.env.NODE_ENV !== 'production',
      
      // Compression for network traffic
      compressors: ['zlib'],
    });
    
    // Disable buffering for failed initial connections
    mongoose.set('bufferCommands', false);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
