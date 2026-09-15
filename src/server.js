import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import startResumeCleanupJob from "./jobs/cleanupExpiredResumes.js";

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // Wait for MongoDB before accepting traffic (avoids mongoose buffering timeouts)
  await connectDB();

  startResumeCleanupJob();

  const server = app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });

  process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
