import express from "express";
import {
  getProviders,
  getProviderById,
} from "../controllers/provider.controller.js";

const router = express.Router();

router.get("/", getProviders);
router.get("/:id", getProviderById);

export default router;
