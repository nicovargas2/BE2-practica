import mongoose from "mongoose";
import envsConfig from './envs.config.js';

export const connectMongoDB = async () => {
  try {
    mongoose.connect(envsConfig.MONGO_URI)
    console.log("MongoDB connected");

  } catch (error) {
    console.log(`Error: ${error}`);
  }
}