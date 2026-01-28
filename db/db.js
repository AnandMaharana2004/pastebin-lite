import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
    try {
        if (isConnected) return;

        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error; // don't kill the process in serverless
    }
}
