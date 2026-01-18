import mongoose from "mongoose";
import logger from "./logger";

const MAX_RETRIES = 5;
let retryCount = 0;

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    retryCount++;
    logger.error(
      `MongoDB connection failed (Attempt ${retryCount}/${MAX_RETRIES})`
    );

    if (retryCount >= MAX_RETRIES) {
      logger.error("Max retries reached. Exiting.");
      process.exit(1);
    }

    const retryIn = 3000;
    logger.info(`🔁 Retrying in ${retryIn / 1000} seconds...`);
    setTimeout(connectDB, retryIn);
  }
};
