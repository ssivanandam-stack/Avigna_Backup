import express from "express";
import multer from "multer";
import {
  getBlogs,
  getBlogBySlug,
  getBlogImage,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
} from "../controllers/blog.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// ─── Public Routes ───────────────────────────────────────────────────
router.get("/", getBlogs);
router.get("/image", getBlogImage);

// ─── Admin Routes — MUST come before /:slug ─────────────────────────
router.post("/", protect, createBlog);
router.post(
  "/upload-image",
  protect,
  imageUpload.single("image"),
  uploadBlogImage,
);

// ─── Wildcard Routes LAST ────────────────────────────────────────────
router.get("/:slug", getBlogBySlug);
router.put("/:slug", protect, updateBlog);
router.delete("/:slug", protect, deleteBlog);

export default router;
