import express from "express";
import {
  getPageSetting,
  updatePageSetting,
} from "../controllers/pageSetting.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updatePageSettingSchema } from "../validations/pageSetting.validation.js";

const router = express.Router();

router.get("/:key", getPageSetting);
router.put("/:key", protect, validate(updatePageSettingSchema), updatePageSetting);

export default router;
