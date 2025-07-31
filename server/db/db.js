// server/db/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Ensure environment variables are loaded

const connectToDatabase = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is undefined. Check your .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas via Mongoose');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectToDatabase;


