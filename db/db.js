import mongoose from "mongoose";
export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected successfully");
    } catch (error) {
        console.log("Mongodb connection fail", error);
        process.exit(1)
    }
}