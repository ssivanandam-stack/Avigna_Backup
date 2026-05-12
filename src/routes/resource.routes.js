import express from "express";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─── Public Routes ───────────────────────────────────────────────────
router.get("/", getResources);

// ─── Admin Routes ────────────────────────────────────────────────────
router.post("/", protect, createResource);
router.put("/:id", protect, updateResource);
router.delete("/:id", protect, deleteResource);

export default router;
