import express from "express";
import multer from "multer";
import {
  getAdminProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  reorderProviders,
  uploadProviderImage,
} from "../controllers/provider.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createProviderSchema,
  updateProviderSchema,
  reorderProvidersSchema,
} from "../validations/provider.validation.js";

const router = express.Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

router.use(protect);

router.get("/", getAdminProviders);
router.post(
  "/upload-image",
  imageUpload.single("image"),
  uploadProviderImage,
);
router.patch(
  "/reorder",
  validate(reorderProvidersSchema),
  reorderProviders,
);
router.post("/", validate(createProviderSchema), createProvider);
router.put("/:id", validate(updateProviderSchema), updateProvider);
router.delete("/:id", deleteProvider);

export default router;
