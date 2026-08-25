import express from "express";
import multer from "multer";
import {
  getServices,
  getServiceBySlug,
  getServiceImage,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  uploadServiceImage,
} from "../controllers/service.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../validations/service.validation.js";

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
router.get("/", getServices);
router.get("/image", getServiceImage);

// Admin — before /:slug
router.get("/admin/all", protect, getAdminServices);
router.post(
  "/upload-image",
  protect,
  imageUpload.single("image"),
  uploadServiceImage,
);
router.post("/", protect, validate(createServiceSchema), createService);
router.put("/:id", protect, validate(updateServiceSchema), updateService);
router.delete("/:id", protect, deleteService);

// Public detail by slug
router.get("/:slug", getServiceBySlug);

export default router;
