// this middleware is design for serverless deployment (example : vercel)
import { connectDB } from "../db/db.js";

export const ensureDB = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch {
        res.status(500).json({ message: "Database connection failed" });
    }
};
