import express from "express";
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
} from "../controllers/inquiry.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public — submit a contact form
router.post("/", createInquiry);

// Admin only — read all inquiries (PROTECTED — patient PII/HIPAA)
router.get("/", protect, getInquiries);

// Admin only — update inquiry status (new → reviewed → contacted → resolved)
router.patch("/:id/status", protect, updateInquiryStatus);

export default router;
