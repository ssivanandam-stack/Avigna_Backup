import express from "express";
import {
  getEmployeeLinks,
  getAdminEmployeeLinks,
  createEmployeeLink,
  updateEmployeeLink,
  deleteEmployeeLink,
} from "../controllers/employeeLink.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createEmployeeLinkSchema,
  updateEmployeeLinkSchema,
} from "../validations/employeeLink.validation.js";

const router = express.Router();

// Public — active links for the footer
router.get("/", getEmployeeLinks);

// Admin — must come before /:id style routes if any are added later
router.get("/admin/all", protect, getAdminEmployeeLinks);
router.post(
  "/",
  protect,
  validate(createEmployeeLinkSchema),
  createEmployeeLink,
);
router.put(
  "/:id",
  protect,
  validate(updateEmployeeLinkSchema),
  updateEmployeeLink,
);
router.delete("/:id", protect, deleteEmployeeLink);

export default router;
