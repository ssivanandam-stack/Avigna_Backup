import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import startResumeCleanupJob from "./jobs/cleanupExpiredResumes.js";

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Start scheduled jobs
startResumeCleanupJob();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., sudden DB drop)
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
