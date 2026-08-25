import mongoose from "mongoose";

const insuranceLogoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

insuranceLogoSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model("InsuranceLogo", insuranceLogoSchema);
