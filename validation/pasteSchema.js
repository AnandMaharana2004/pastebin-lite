import mongoose from "mongoose";
import z from "zod";

export const CreatePasteSchema = z.object({
    content: z
        .string({ required_error: "Please provide content" })
        .trim()
        .min(1, "Content cannot be empty"),

    ttl_seconds: z
        .number()
        .int("TTL must be an integer")
        .positive("Please provide a valid number")
        .optional(),

    max_views: z
        .number()
        .int("Max views must be an integer")
        .min(1, "Max views must be at least 1")
        .optional(),
});

export const GetPasteSchema = z.object({
    id: z
        .string({ required_error: "Paste id is required" })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid MongoDB id",
        }),
});

export const getPasteHTMLSchema = z.object({
    id: z
        .string({ required_error: "Paste id is required" })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid MongoDB id",
        }),
})