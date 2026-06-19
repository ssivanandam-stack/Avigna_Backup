import express from "express";
import {
  getAdminProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  reorderProviders,
} from "../controllers/provider.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createProviderSchema,
  updateProviderSchema,
  reorderProvidersSchema,
} from "../validations/provider.validation.js";

const router = express.Router();

router.use(protect);

router.get("/", getAdminProviders);
router.patch(
  "/reorder",
  validate(reorderProvidersSchema),
  reorderProviders,
);
router.post("/", validate(createProviderSchema), createProvider);
router.put("/:id", validate(updateProviderSchema), updateProvider);
router.delete("/:id", deleteProvider);

export default router;
