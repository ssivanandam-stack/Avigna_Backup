import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // Will point to an AWS S3 URL
      required: true,
    },
    accentColor: {
      type: String, // e.g., "#ff5c00"
      default: "#111111",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
