import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    patientStatus: {
      type: String,
      required: true,
      enum: ["new", "existing", "referral"],
    },
    contactReason: { type: String, required: true },
    clinician: { type: String }, // Optional, only if 'new' or 'existing'
    referralSource: { type: String }, // Optional, only if 'referral'
    message: { type: String, required: true },
    permissionGranted: { type: Boolean, required: true },
    // Admin tracking fields
    status: {
      type: String,
      default: "new",
      enum: ["new", "reviewed", "contacted", "resolved"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Inquiry", inquirySchema);
