import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter using SMTP
// Supports Gmail, Outlook, custom SMTP, etc.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup (non-blocking)
transporter.verify((error) => {
  if (error) {
    console.warn("⚠️  SMTP connection failed:", error.message);
    console.warn("   Career emails will not be sent until SMTP is configured.");
  } else {
    console.log("✅ SMTP mail server connected & ready");
  }
});

export default transporter;
