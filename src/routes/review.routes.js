import express from "express";
import {
  createReview,
  getApprovedReviews,
  getAllReviews,
  updateReviewStatus,
} from "../controllers/review.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReviewSchema } from "../validations/review.validation.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", validate(createReviewSchema), createReview);
router.get("/", getApprovedReviews);
router.get("/admin", protect, getAllReviews);
router.patch("/:id/status", protect, updateReviewStatus); // <-- NEW ROUTE FOR TOGGLING

export default router;
