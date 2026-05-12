import transporter from "../config/nodemailer.config.js";

const FROM_NAME = "Avighna Holistic Care";
const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

// ─── Base HTML wrapper ───────────────────────────────────────────────
const wrapHtml = (body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:#111111;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
                Avighna<span style="color:#14b8a6;">.</span>
              </h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.5);font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">
                Holistic Care
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:24px 40px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;color:#999;font-size:12px;line-height:1.6;">
                Avighna Holistic Care &bull; Raleigh, NC<br />
                <a href="https://avighnahc.com" style="color:#14b8a6;text-decoration:none;">avighnahc.com</a> &bull;
                (919) 322-0140
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── 1. Application Received (to applicant) ──────────────────────────
export const sendApplicationReceived = async ({
  to,
  applicantName,
  jobTitle,
}) => {
  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;color:#111;font-size:24px;font-weight:600;">
      Application Received
    </h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.7;">
      Hi ${applicantName},
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Thank you for your interest in the <strong style="color:#111;">${jobTitle}</strong> position at
      Avighna Holistic Care. We've successfully received your application and resume.
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Our team will carefully review your qualifications. If your profile matches our needs,
      we'll reach out to schedule a conversation. You can expect to hear from us within
      <strong style="color:#111;">5–7 business days</strong>.
    </p>
    <div style="background:#f0fdf9;border-left:4px solid #14b8a6;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
      <p style="margin:0;color:#111;font-size:14px;font-weight:600;">What happens next?</p>
      <p style="margin:8px 0 0;color:#555;font-size:14px;line-height:1.6;">
        Application Review → Phone Screen → Interview → Decision
      </p>
    </div>
    <p style="margin:24px 0 0;color:#666;font-size:15px;line-height:1.7;">
      We appreciate your time and look forward to learning more about you.
    </p>
  `);

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `Application Received — ${jobTitle} | Avighna Holistic Care`,
    html,
  });
};

// ─── 2. Admin Notification (new application) ─────────────────────────
export const sendAdminNewApplication = async ({
  applicantName,
  applicantEmail,
  jobTitle,
  jobId,
  applicationId,
}) => {
  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;color:#111;font-size:24px;font-weight:600;">
      📋 New Application
    </h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.7;">
      A new application has been submitted.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:12px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:20px;">
          <p style="margin:0 0 12px;color:#111;font-size:14px;">
            <strong>Applicant:</strong> ${applicantName}
          </p>
          <p style="margin:0 0 12px;color:#111;font-size:14px;">
            <strong>Email:</strong> <a href="mailto:${applicantEmail}" style="color:#14b8a6;">${applicantEmail}</a>
          </p>
          <p style="margin:0;color:#111;font-size:14px;">
            <strong>Position:</strong> ${jobTitle}
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#666;font-size:14px;">
      Log in to the <a href="https://avighnahc.com/admin" style="color:#14b8a6;font-weight:600;">Admin Panel</a> to review this application.
    </p>
  `);

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `New Application: ${applicantName} → ${jobTitle}`,
    html,
  });
};

// ─── 3. Status: Reviewing ────────────────────────────────────────────
export const sendStatusReviewing = async ({ to, applicantName, jobTitle }) => {
  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;color:#111;font-size:24px;font-weight:600;">
      Your Application is Under Review
    </h2>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Hi ${applicantName},
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Good news! Your application for <strong style="color:#111;">${jobTitle}</strong> has moved forward
      and is now being <strong style="color:#14b8a6;">actively reviewed</strong> by our hiring team.
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      We're carefully evaluating your qualifications and experience. If we'd like to move
      forward, we'll be in touch to schedule the next step.
    </p>
    <p style="margin:0;color:#666;font-size:15px;line-height:1.7;">
      Thank you for your patience and continued interest.
    </p>
  `);

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `Update: Your Application is Under Review — ${jobTitle}`,
    html,
  });
};

// ─── 4. Status: Interviewing ─────────────────────────────────────────
export const sendStatusInterviewing = async ({
  to,
  applicantName,
  jobTitle,
  interviewDate,
  interviewLink,
}) => {
  const dateStr = interviewDate
    ? new Date(interviewDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;color:#111;font-size:24px;font-weight:600;">
      🎉 Interview Invitation
    </h2>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Hi ${applicantName},
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      We're impressed with your background and would love to learn more about you!
      We'd like to invite you for an interview for the
      <strong style="color:#111;">${jobTitle}</strong> position.
    </p>
    ${
      dateStr
        ? `
    <div style="background:#f0fdf9;border-radius:12px;padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 4px;color:#14b8a6;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">
        Interview Details
      </p>
      <p style="margin:0;color:#111;font-size:16px;font-weight:600;">
        📅 ${dateStr}
      </p>
      ${
        interviewLink
          ? `
      <p style="margin:12px 0 0;">
        <a href="${interviewLink}" style="display:inline-block;background:#14b8a6;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;">
          Join Interview →
        </a>
      </p>
      `
          : ""
      }
    </div>
    `
        : `
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      We'll follow up shortly with specific scheduling details. Please keep an eye on your inbox.
    </p>
    `
    }
    <p style="margin:0;color:#666;font-size:15px;line-height:1.7;">
      If you have any questions or need to reschedule, please don't hesitate to reach out
      at <a href="mailto:${ADMIN_EMAIL}" style="color:#14b8a6;">${ADMIN_EMAIL}</a>.
    </p>
  `);

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `Interview Invitation — ${jobTitle} | Avighna Holistic Care`,
    html,
  });
};

// ─── 5. Status: Accepted ─────────────────────────────────────────────
export const sendStatusAccepted = async ({ to, applicantName, jobTitle }) => {
  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;color:#111;font-size:24px;font-weight:600;">
      🎊 Congratulations!
    </h2>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Dear ${applicantName},
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      We are thrilled to inform you that after careful consideration, we would like to
      <strong style="color:#14b8a6;">extend an offer</strong> for the
      <strong style="color:#111;">${jobTitle}</strong> position at Avighna Holistic Care.
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Your skills, experience, and passion for holistic mental healthcare truly stood out during
      our evaluation process. We believe you'll be a wonderful addition to our team.
    </p>
    <div style="background:#f0fdf9;border-left:4px solid #14b8a6;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
      <p style="margin:0;color:#111;font-size:14px;font-weight:600;">Next Steps</p>
      <p style="margin:8px 0 0;color:#555;font-size:14px;line-height:1.6;">
        A member of our team will reach out within 1–2 business days with your
        formal offer letter and onboarding details.
      </p>
    </div>
    <p style="margin:0;color:#666;font-size:15px;line-height:1.7;">
      Welcome to the Avighna family! We can't wait to work with you.
    </p>
  `);

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `Offer Extended — ${jobTitle} | Avighna Holistic Care`,
    html,
  });
};

// ─── 6. Status: Rejected (polite, with 30-day data notice) ──────────
export const sendStatusRejected = async ({ to, applicantName, jobTitle }) => {
  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;color:#111;font-size:24px;font-weight:600;">
      Application Update
    </h2>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Dear ${applicantName},
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Thank you for taking the time to apply for the
      <strong style="color:#111;">${jobTitle}</strong> position at Avighna Holistic Care.
      We truly appreciate your interest in joining our team.
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      After thorough review, we have decided to move forward with other candidates whose
      experience more closely aligns with our current needs. This was not an easy decision,
      and it does not diminish the value of your qualifications.
    </p>
    <div style="background:#fff8f0;border-left:4px solid #ff5c00;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
      <p style="margin:0;color:#111;font-size:14px;font-weight:600;">Data Privacy Notice</p>
      <p style="margin:8px 0 0;color:#555;font-size:14px;line-height:1.6;">
        Per our data retention policy, your resume and application documents will be
        securely removed from our systems within <strong>30 days</strong> of your
        original submission date.
      </p>
    </div>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      We encourage you to keep an eye on our
      <a href="https://avighnahc.com/careers" style="color:#14b8a6;font-weight:600;">careers page</a>
      for future openings that may be a great fit. We'd love to hear from you again.
    </p>
    <p style="margin:0;color:#666;font-size:15px;line-height:1.7;">
      Wishing you all the best in your career journey.
    </p>
  `);

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `Application Update — ${jobTitle} | Avighna Holistic Care`,
    html,
  });
};

// ─── 7. Auto-expiry reminder (sent by cron before deleting resume) ───
export const sendResumeExpiryNotice = async ({
  to,
  applicantName,
  jobTitle,
}) => {
  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;color:#111;font-size:24px;font-weight:600;">
      Data Retention Notice
    </h2>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Dear ${applicantName},
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      This is to inform you that your resume submitted for the
      <strong style="color:#111;">${jobTitle}</strong> position has reached our
      30-day retention period and has been <strong>securely deleted</strong> from our systems.
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      If you'd like to be considered for future opportunities, you're welcome to submit
      a new application through our
      <a href="https://avighnahc.com/careers" style="color:#14b8a6;font-weight:600;">careers page</a>
      at any time.
    </p>
    <p style="margin:0;color:#666;font-size:15px;line-height:1.7;">
      Thank you for your interest in Avighna Holistic Care.
    </p>
  `);

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `Your Resume Has Been Removed — Avighna Holistic Care`,
    html,
  });
};
