// src/routes/prescreen.routes.js
import express from "express";
import {
  getQuestionsForJob,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  setJobQuestions,
  seedQuestions,
} from "../controllers/prescreen.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─── Public ──────────────────────────────────────────────────────────
// Fetch questions for a specific job's application form
router.get("/job/:jobId", getQuestionsForJob);

// ─── Admin ───────────────────────────────────────────────────────────
// Global question bank CRUD
router.get("/", protect, getAllQuestions);
router.post("/", protect, createQuestion);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);

// Attach question set to a job posting
router.put("/job/:jobId/questions", protect, setJobQuestions);

// One-time seed — disable after first run
router.post("/seed", protect, seedQuestions);

export default router;
