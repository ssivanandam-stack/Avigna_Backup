// src/models/Career.js
import mongoose from "mongoose";

/**
 * Each job posting can reference up to 5 prescreen questions
 * from the global PrescreenQuestion bank.
 * The order array controls display order.
 */
const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Per Diem", "Internship"],
    },
    location: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    salaryMin: {
      type: Number,
      default: null,
    },
    salaryMax: {
      type: Number,
      default: null,
    },
    salaryType: {
      type: String,
      enum: ["hourly", "yearly"],
      default: "yearly",
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    accentColor: {
      type: String,
      default: "#14b8a6",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ─── Prescreen Questions ─────────────────────────────────────────
    // References to PrescreenQuestion documents, ordered by position
    prescreenQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrescreenQuestion",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual: count of applications for this job
careerSchema.virtual("applicantCount", {
  ref: "Application",
  localField: "_id",
  foreignField: "job",
  count: true,
});

// Auto-generate slug from title before saving
careerSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.model("Career", careerSchema);
