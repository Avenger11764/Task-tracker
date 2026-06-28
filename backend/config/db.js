import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Running in Fallback In-Memory Mode (Tasks will not persist across server restarts).');
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => isConnected;
