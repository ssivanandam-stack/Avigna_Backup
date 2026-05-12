import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String, // e.g., "Worksheet (PDF)"
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // Will point to the actual PDF uploaded to AWS S3
      required: true,
    },
    accentColor: {
      type: String,
      default: "#14b8a6",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Resource", resourceSchema);
