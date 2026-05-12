import Inquiry from "../models/Inquiry.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Create new inquiry from Contact Page
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      patientStatus,
      contactReason,
      clinician,
      referralSource,
      message,
      permissionGranted,
    } = req.body;

    if (!permissionGranted) {
      return res.status(400).json({
        success: false,
        message: "Permission to contact is required.",
      });
    }

    const newInquiry = await Inquiry.create({
      firstName,
      lastName,
      email,
      phone,
      patientStatus,
      contactReason,
      clinician: patientStatus !== "referral" ? clinician : undefined,
      referralSource: patientStatus === "referral" ? referralSource : undefined,
      message,
      permissionGranted,
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: newInquiry,
    });
  } catch (error) {
    console.error("Error saving inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching inquiries.",
    });
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id/status
// @access  Private/Admin
export const updateInquiryStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["new", "reviewed", "contacted", "resolved"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    );
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  );

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, inquiry, `Inquiry status updated to "${status}"`),
    );
});
