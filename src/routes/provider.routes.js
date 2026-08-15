import express from "express";
import {
  getProviders,
  getProviderById,
  getProviderImage,
} from "../controllers/provider.controller.js";

const router = express.Router();

router.get("/", getProviders);
router.get("/image", getProviderImage);
router.get("/:id", getProviderById);

export default router;
