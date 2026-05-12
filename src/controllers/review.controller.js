import Review from "../models/Review.js";
import { catchAsync } from "../utils/catchAsync.js";

// @desc    Submit a new patient review
// @route   POST /api/reviews
// @access  Public
export const createReview = catchAsync(async (req, res, next) => {
  const {
    providerName,
    providerRole,
    firstName,
    lastName,
    email,
    wouldRecommend,
    feedback,
    rating,
  } = req.body;

  const review = await Review.create({
    providerName,
    providerRole,
    firstName,
    lastName,
    email,
    wouldRecommend,
    feedback,
    rating,
    // Automatically hide negative feedback; queue positive feedback for admin approval
    status: wouldRecommend ? "pending" : "private",
  });

  res.status(201).json({
    status: "success",
    message: "Review submitted successfully. Thank you for your feedback.",
  });
});

// @desc    Get all approved reviews for the public website
// @route   GET /api/reviews
// @access  Public
export const getApprovedReviews = catchAsync(async (req, res, next) => {
  // Only fetch reviews that an admin has manually marked as 'approved'
  const reviews = await Review.find({ status: "approved" }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews,
  });
});

// @desc    Get ALL reviews (Admin only - sees pending, private, and approved)
// @route   GET /api/reviews/admin
// @access  Private/Admin
export const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews,
  });
});

// @desc    Update review status
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['pending', 'approved', 'private'].includes(status)) {
    return res.status(400).json({ status: 'error', message: 'Invalid status' });
  }

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: `Review marked as ${status}`,
    data: review,
  });
});
