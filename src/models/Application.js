// src/models/Application.js
import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: "" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

/**
 * Stores one candidate's answer to a prescreen question.
 * - question: ref to PrescreenQuestion
 * - answer:   free text for "open" type
 * - score:    computed from the chosen option for yes_no / select
 * - isKnockout: true if the chosen option was flagged knockout
 */
const prescreenAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrescreenQuestion",
      required: true,
    },
    questionText: {
      // snapshot so we keep the text even if the question is later edited
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      default: 0,
    },
    isKnockout: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true, default: "" },
    coverLetter: { type: String, default: "" },

    // ─── Resume (S3) ────────────────────────────────────────────────
    resumeUrl: { type: String, required: true },
    resumeS3Key: { type: String, required: true },
    resumeDeleted: { type: Boolean, default: false },
    resumeExpiresAt: { type: Date, required: true },

    // ─── Prescreen Answers ──────────────────────────────────────────
    prescreenAnswers: {
      type: [prescreenAnswerSchema],
      default: [],
    },

    /**
     * Derived totals — computed when the application is created.
     * Makes it easy to sort / filter in the admin dashboard.
     */
    prescreenScore: {
      type: Number,
      default: 0,
    },
    prescreenKnockout: {
      type: Boolean,
      default: false,
    },

    // ─── Status Pipeline ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["applied", "reviewing", "interviewing", "accepted", "rejected"],
      default: "applied",
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    interviewDate: { type: Date, default: null },
    interviewLink: { type: String, default: "" },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

// Index for the cleanup cron job
applicationSchema.index({ resumeExpiresAt: 1, resumeDeleted: 1 });
// Index for querying applications by job
applicationSchema.index({ job: 1, status: 1 });
// Index for sorting by score in the admin dashboard
applicationSchema.index({ job: 1, prescreenScore: -1 });

// Push initial status on creation
applicationSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: "applied",
      note: "Application submitted",
      changedAt: new Date(),
    });
  }
  next();
});

export default mongoose.model("Application", applicationSchema);
