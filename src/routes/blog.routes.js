import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─── Public Routes ───────────────────────────────────────────────────
router.get("/", getBlogs);

// ─── Admin Routes — MUST come before /:slug ─────────────────────────
router.post("/", protect, createBlog);

// ─── Wildcard Routes LAST ────────────────────────────────────────────
router.get("/:slug", getBlogBySlug);
router.put("/:slug", protect, updateBlog);
router.delete("/:slug", protect, deleteBlog);

export default router;
