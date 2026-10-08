import mongoose from "mongoose";

const qaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 500 },
    answer: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { _id: false },
);

const pricingSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 300 },
    price: { type: String, required: true, trim: true, maxlength: 80 },
    note: { type: String, trim: true, default: "self-pay", maxlength: 80 },
  },
  { _id: false },
);

const programSchema = new mongoose.Schema(
  {
    tabName: { type: String, required: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    icon: {
      type: String,
      trim: true,
      default: "brain",
      enum: ["brain", "heart", "clipboard", "stethoscope", "users"],
    },
    accentColor: { type: String, trim: true, default: "#ff5c00", maxlength: 30 },
    about: { type: String, trim: true, default: "", maxlength: 8000 },
    whoItHelps: { type: [String], default: [] },
    whatsIncluded: { type: [String], default: [] },
    pricing: { type: [pricingSchema], default: [] },
    image: { type: String, trim: true, default: "", maxlength: 2000 },
    qa: { type: [qaSchema], default: [] },
    ctaLabel: {
      type: String,
      trim: true,
      default: "Schedule an Evaluation",
      maxlength: 120,
    },
    ctaUrl: { type: String, trim: true, default: "/contact", maxlength: 500 },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true },
);

const serviceSchema = new mongoose.Schema(
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
      default: "Comprehensive Therapy",
    },
    templateType: {
      type: String,
      enum: ["standard", "specialized"],
      default: "standard",
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
    specializedHeading: {
      type: String,
      trim: true,
      default: "Specialized Programs",
      maxlength: 200,
    },
    specializedIntro: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    qa: {
      type: [qaSchema],
      default: [],
    },
    programs: {
      type: [programSchema],
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

serviceSchema.index({ isActive: 1, displayOrder: 1 });
serviceSchema.index({ section: 1, displayOrder: 1 });

export default mongoose.model("Service", serviceSchema);
