import { Schema, model } from "mongoose";

const pasteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    deleteAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

pasteSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

export const Paste = model("Paste", pasteSchema);
