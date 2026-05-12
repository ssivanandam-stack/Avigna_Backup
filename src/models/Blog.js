import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxLength: 300,
    },
    content: {
      type: String, // Can store HTML or Markdown from your CMS
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    coverImageUrl: {
      type: String, // Will point to an AWS S3 URL
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
