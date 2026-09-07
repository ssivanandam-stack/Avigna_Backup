import cron from "node-cron";
import Application from "../models/Application.js";
import { deleteFileFromS3 } from "../services/s3.service.js";
import {
  sendStatusRejected,
  sendResumeExpiryNotice,
} from "../services/career-email.service.js";

/**
 * Cleanup expired resumes
 *
 * Runs daily at 2:00 AM.
 * Finds applications where:
 *   - resumeExpiresAt has passed
 *   - resumeDeleted is still false
 *
 * For each expired application:
 *   1. If status is still "applied" or "reviewing" (never got a decision),
 *      send polite rejection email first
 *   2. Send data retention / resume expiry notice
 *   3. Delete resume from S3
 *   4. Mark resumeDeleted = true (always, even if S3/email fails)
 */
const startResumeCleanupJob = () => {
  // Run every day at 2:00 AM server time
  cron.schedule("0 2 * * *", async () => {
    console.log("🕐 [Cron] Starting expired resume cleanup...");

    try {
      const expiredApplications = await Application.find({
        resumeExpiresAt: { $lte: new Date() },
        resumeDeleted: false,
      }).populate("job", "title");

      if (expiredApplications.length === 0) {
        console.log("✅ [Cron] No expired resumes found. All clean.");
        return;
      }

      console.log(
        `📋 [Cron] Found ${expiredApplications.length} expired resume(s) to process.`,
      );

      let deletedCount = 0;
      let emailsSent = 0;

      for (const app of expiredApplications) {
        const applicantName = `${app.firstName} ${app.lastName}`;
        const jobTitle = app.job?.title || "the applied position";

        try {
          // If they never got a decision, send rejection email first
          if (["applied", "reviewing"].includes(app.status)) {
            try {
              await sendStatusRejected({
                to: app.email,
                applicantName,
                jobTitle,
              });
              emailsSent++;

              app.status = "rejected";
              app.statusHistory.push({
                status: "rejected",
                note: "Auto-rejected: 30-day retention period expired without a decision",
                changedAt: new Date(),
              });
            } catch (emailErr) {
              console.error(
                `  ⚠️  Rejection email failed for ${app.email}:`,
                emailErr.message,
              );
            }
          }

          // Send resume expiry notice (only once — we mark deleted below either way)
          try {
            await sendResumeExpiryNotice({
              to: app.email,
              applicantName,
              jobTitle,
            });
            emailsSent++;
          } catch (emailErr) {
            console.error(
              `  ⚠️  Expiry notice email failed for ${app.email}:`,
              emailErr.message,
            );
          }

          // Delete resume from S3 (non-fatal)
          let deleted = false;
          try {
            deleted = await deleteFileFromS3(app.resumeS3Key);
          } catch (s3Err) {
            console.error(
              `  ⚠️  S3 delete failed for ${app.email}:`,
              s3Err.message,
            );
          }

          // Always mark deleted so the cron does not re-email every day
          app.resumeDeleted = true;
          app.resumeUrl = "";
          app.resumeS3Key = "";
          await app.save();

          if (deleted) deletedCount++;

          console.log(`  ✅ Processed: ${applicantName} (${app.email})`);
        } catch (appErr) {
          console.error(
            `  ❌ Error processing application ${app._id}:`,
            appErr.message,
          );

          // Last resort: force-mark deleted so daily emails cannot loop
          try {
            await Application.updateOne(
              { _id: app._id },
              {
                $set: {
                  resumeDeleted: true,
                  resumeUrl: "",
                  resumeS3Key: "",
                },
              },
            );
            console.log(
              `  🔒 Force-marked resumeDeleted for application ${app._id}`,
            );
          } catch (forceErr) {
            console.error(
              `  ❌ Failed to force-mark application ${app._id}:`,
              forceErr.message,
            );
          }
        }
      }

      console.log(
        `🏁 [Cron] Cleanup complete. Deleted: ${deletedCount}/${expiredApplications.length} resumes, Emails sent: ${emailsSent}`,
      );
    } catch (error) {
      console.error("❌ [Cron] Resume cleanup job failed:", error.message);
    }
  });

  console.log("📅 Resume cleanup cron job scheduled (daily at 2:00 AM)");
};

export default startResumeCleanupJob;
