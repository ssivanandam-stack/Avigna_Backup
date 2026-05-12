import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    providerName: {
      type: String,
      required: true,
    },
    providerRole: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    wouldRecommend: {
      type: Boolean,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "private"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Review", reviewSchema);
