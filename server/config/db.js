const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // process.env.MONGO_URI hamari .env file se address uthata hai
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("🚀 Database communication channel operational (MongoDB Connected)...");
  } catch (err) {
    console.error("❌ DB Engine failure:", err.message);
    // Agar database connect nahi hua, toh server ko band kar do
    process.exit(1); 
  }
};

module.exports = connectDB; // Ise export kiya taaki server.js me use kar sakein