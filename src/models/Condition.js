import mongoose from "mongoose";

const qaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 500 },
    answer: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { _id: false },
);

const conditionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    section: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      default: "Mental Health",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showInNav: {
      type: Boolean,
      default: true,
    },
    emoji: {
      type: String,
      trim: true,
      default: "",
      maxlength: 16,
    },
    accent: {
      type: String,
      trim: true,
      default: "#14b8a6",
      maxlength: 30,
    },
    image: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    intro: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },
    qa: {
      type: [qaSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

conditionSchema.index({ isActive: 1, displayOrder: 1 });
conditionSchema.index({ section: 1, displayOrder: 1 });

export default mongoose.model("Condition", conditionSchema);
