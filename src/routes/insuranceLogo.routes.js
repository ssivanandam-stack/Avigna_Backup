import express from "express";
import multer from "multer";
import {
  getInsuranceLogos,
  getInsuranceLogoImage,
  getAdminInsuranceLogos,
  createInsuranceLogo,
  updateInsuranceLogo,
  deleteInsuranceLogo,
  uploadInsuranceLogoImage,
} from "../controllers/insuranceLogo.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createInsuranceLogoSchema,
  updateInsuranceLogoSchema,
} from "../validations/insuranceLogo.validation.js";

const router = express.Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

router.get("/", getInsuranceLogos);
router.get("/image", getInsuranceLogoImage);

router.get("/admin/all", protect, getAdminInsuranceLogos);
router.post(
  "/upload-image",
  protect,
  imageUpload.single("image"),
  uploadInsuranceLogoImage,
);
router.post(
  "/",
  protect,
  validate(createInsuranceLogoSchema),
  createInsuranceLogo,
);
router.put(
  "/:id",
  protect,
  validate(updateInsuranceLogoSchema),
  updateInsuranceLogo,
);
router.delete("/:id", protect, deleteInsuranceLogo);

export default router;
