import mongoose from 'mongoose';
import { serverConfig } from './index';

export async function connectDB() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortner';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(`Error connecting to Mongo DB`, error);
    throw error;
  }
}
