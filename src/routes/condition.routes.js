import express from "express";
import multer from "multer";
import {
  getConditions,
  getConditionBySlug,
  getConditionImage,
  getAdminConditions,
  createCondition,
  updateCondition,
  deleteCondition,
  uploadConditionImage,
} from "../controllers/condition.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createConditionSchema,
  updateConditionSchema,
} from "../validations/condition.validation.js";

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

// Public
router.get("/", getConditions);
router.get("/image", getConditionImage);

// Admin — before /:slug
router.get("/admin/all", protect, getAdminConditions);
router.post(
  "/upload-image",
  protect,
  imageUpload.single("image"),
  uploadConditionImage,
);
router.post("/", protect, validate(createConditionSchema), createCondition);
router.put("/:id", protect, validate(updateConditionSchema), updateCondition);
router.delete("/:id", protect, deleteCondition);

// Public detail by slug
router.get("/:slug", getConditionBySlug);

export default router;
