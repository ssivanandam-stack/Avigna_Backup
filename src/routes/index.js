// src/routes/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import inquiryRoutes from "./inquiry.routes.js";
import reviewRoutes from "./review.routes.js";
import blogRoutes from "./blog.routes.js";
import productRoutes from "./product.routes.js";
import careerRoutes from "./career.routes.js";
import resourceRoutes from "./resource.routes.js";
import applicationRoutes from "./application.routes.js";
import prescreenRoutes from "./prescreen.routes.js"; // ← ADD THIS

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/blogs", blogRoutes);
router.use("/products", productRoutes);
router.use("/careers", careerRoutes);
router.use("/resources", resourceRoutes);
router.use("/applications", applicationRoutes);
router.use("/prescreen", prescreenRoutes); // ← ADD THIS

export default router;
