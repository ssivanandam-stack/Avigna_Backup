// src/models/PrescreenQuestion.js
import mongoose from "mongoose";

/**
 * A "PrescreenQuestion" lives in a global library.
 * Each job posting references an array of these by ID.
 *
 * type:
 *   "open"    → free-text answer (textarea on the form)
 *   "yes_no"  → Yes / No radio, each option can carry a score + knockout flag
 *   "select"  → dropdown/radio from a list of custom options
 */

const yesNoOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // "Yes" | "No"
    score: { type: Number, default: 0 }, // scoring weight (0–10)
    isKnockout: { type: Boolean, default: false }, // auto-flag if chosen
  },
  { _id: false },
);

const selectOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    score: { type: Number, default: 0 },
    isKnockout: { type: Boolean, default: false },
  },
  { _id: false },
);

const prescreenQuestionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["open", "yes_no", "select"],
      default: "open",
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    // Only used when type === "yes_no"
    yesNoOptions: {
      type: [yesNoOptionSchema],
      default: [],
    },
    // Only used when type === "select"
    selectOptions: {
      type: [selectOptionSchema],
      default: [],
    },
    // Soft-delete / archive
    isActive: {
      type: Boolean,
      default: true,
    },
    // Which category this belongs to for filtering in the question picker
    category: {
      type: String,
      default: "General",
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("PrescreenQuestion", prescreenQuestionSchema);
