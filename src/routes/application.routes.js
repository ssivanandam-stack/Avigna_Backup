import express from "express";
import multer from "multer";
import {
  submitApplication,
  getAllApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  updateApplicationNotes,
  getApplicationStats,
} from "../controllers/application.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents are allowed"), false);
    }
  },
});

// ─── Admin Routes (Protected) — MUST come before /:id ───────────────
router.get("/", protect, getAllApplications);
router.get("/stats", protect, getApplicationStats);
router.get("/job/:jobId", protect, getApplicationsByJob);

// ─── Wildcard routes LAST ────────────────────────────────────────────
router.post("/:jobId", upload.single("resume"), submitApplication);
router.get("/:id", protect, getApplicationById);
router.patch("/:id/status", protect, updateApplicationStatus);
router.patch("/:id/notes", protect, updateApplicationNotes);

export default router;
