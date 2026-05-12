import express from "express";
import {
  getCareers,
  getCareerById,
  getAdminCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  getDepartments,
} from "../controllers/career.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─── Public Routes ───────────────────────────────────────────────────
// IMPORTANT: specific named routes MUST come before /:id
router.get("/departments", getDepartments);
router.get("/", getCareers);

// ─── Admin Routes (Protected) ───────────────────────────────────────
// IMPORTANT: /admin/all MUST come before /:id
router.get("/admin/all", protect, getAdminCareers);
router.post("/", protect, createCareer);

// ─── Wildcard routes LAST ────────────────────────────────────────────
router.get("/:id", getCareerById);
router.put("/:id", protect, updateCareer);
router.delete("/:id", protect, deleteCareer);

export default router;
