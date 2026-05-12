import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const createAdmin = async () => {
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminPassword) {
    console.error(
      "❌ ERROR: ADMIN_SEED_PASSWORD environment variable is not set.",
    );
    console.error("   Add it to your .env file before running this script.");
    process.exit(1);
  }

  if (adminPassword.length < 12) {
    console.error(
      "❌ ERROR: ADMIN_SEED_PASSWORD must be at least 12 characters.",
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log("⚠️  Admin user already exists. Skipping creation.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await User.create({
    name: "Avighna Admin",
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
  });

  console.log("✅ Admin user created successfully!");
  console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error("❌ Failed to create admin:", err.message);
  process.exit(1);
});
