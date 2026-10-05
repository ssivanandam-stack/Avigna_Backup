import express from "express";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../controllers/adminUser.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createAdminUserSchema,
  updateAdminUserSchema,
} from "../validations/adminUser.validation.js";

const router = express.Router();

router.use(protect);

router.get("/", getAdminUsers);
router.post("/", validate(createAdminUserSchema), createAdminUser);
router.put("/:id", validate(updateAdminUserSchema), updateAdminUser);
router.delete("/:id", deleteAdminUser);

export default router;
