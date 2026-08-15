import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    credentials: {
      type: String,
      trim: true,
      default: "",
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
      default: "Therapists",
    },
    shortBio: {
      type: String,
      trim: true,
      default: "",
    },
    fullBio: {
      type: String,
      trim: true,
      default: "",
    },
    profileImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: null,
    },
    languages: {
      type: [String],
      default: [],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

providerSchema.index({ status: 1, isDeleted: 1, section: 1, displayOrder: 1 });
providerSchema.index({ isDeleted: 1, displayOrder: 1 });

export default mongoose.model("Provider", providerSchema);
