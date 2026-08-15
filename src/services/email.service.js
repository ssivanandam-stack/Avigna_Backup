import { sendMail } from "./mail.service.js";

const FROM_NAME = "Avighna Holistic Care";
const INQUIRY_EMAIL =
  process.env.INQUIRY_EMAIL || "avighna@avighnahc.com";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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
          <tr>
            <td style="padding:40px;">
              ${body}
            </td>
          </tr>
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

const toPlainInquiry = (inquiryData) =>
  typeof inquiryData?.toObject === "function"
    ? inquiryData.toObject()
    : inquiryData;

export const sendInquiryNotification = async (inquiryData) => {
  const inquiry = toPlainInquiry(inquiryData);
  const {
    firstName,
    lastName,
    email,
    phone,
    patientStatus,
    contactReason,
    clinician,
    referralSource,
    message,
  } = inquiry;

  const details = [
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Patient Status: ${patientStatus}`,
    `Contact Reason: ${contactReason}`,
    clinician ? `Clinician: ${clinician}` : null,
    referralSource ? `Referral Source: ${referralSource}` : null,
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  return sendMail({
    from: `"${FROM_NAME}" <${INQUIRY_EMAIL}>`,
    to: INQUIRY_EMAIL,
    replyTo: email,
    subject: `New Book Now Inquiry: ${firstName} ${lastName}`,
    text: `New Book Now Inquiry\n\n${details}`,
  });
};

export const sendInquiryConfirmation = async (inquiryData) => {
  const inquiry = toPlainInquiry(inquiryData);
  const { firstName, lastName, email, contactReason } = inquiry;
  const recipientEmail = String(email || "").trim();

  if (!recipientEmail) {
    throw new Error("Missing recipient email for inquiry confirmation");
  }

  const fullName = `${firstName} ${lastName}`;
  const safeName = escapeHtml(fullName);
  const safeReason = escapeHtml(contactReason || "your request");

  const text = [
    `Hi ${fullName},`,
    "",
    "Thank you for reaching out to Avighna Holistic Care. We've successfully received your Book Now request.",
    `Topic: ${contactReason || "your request"}`,
    "",
    "A member of our team will review your message and contact you within 1-2 business days.",
    "",
    "Need immediate help? Call us at (919) 322-0140 or reply to this email.",
    "",
    "We look forward to connecting with you.",
    "",
    "Avighna Holistic Care",
    "https://avighnahc.com",
  ].join("\n");

  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;color:#111;font-size:24px;font-weight:600;">
      Request Received
    </h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.7;">
      Hi ${safeName},
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      Thank you for reaching out to Avighna Holistic Care. We've successfully received your
      <strong style="color:#111;">Book Now</strong> request regarding
      <strong style="color:#111;">${safeReason}</strong>.
    </p>
    <p style="margin:0 0 16px;color:#666;font-size:15px;line-height:1.7;">
      A member of our team will review your message and contact you within
      <strong style="color:#111;">1–2 business days</strong>.
    </p>
    <div style="background:#f0fdf9;border-left:4px solid #14b8a6;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
      <p style="margin:0;color:#111;font-size:14px;font-weight:600;">Need immediate help?</p>
      <p style="margin:8px 0 0;color:#555;font-size:14px;line-height:1.6;">
        Call us at (919) 322-0140 or reply to this email.
      </p>
    </div>
    <p style="margin:0;color:#666;font-size:15px;line-height:1.7;">
      We look forward to connecting with you.
    </p>
  `);

  return sendMail({
    from: `"${FROM_NAME}" <${INQUIRY_EMAIL}>`,
    to: recipientEmail,
    replyTo: INQUIRY_EMAIL,
    subject: "We Received Your Request | Avighna Holistic Care",
    html,
    text,
  });
};

export const sendInquiryEmails = async (inquiryData) => {
  const results = await Promise.allSettled([
    sendInquiryNotification(inquiryData),
    sendInquiryConfirmation(inquiryData),
  ]);

  const labels = ["admin notification", "user confirmation"];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`✅ Inquiry ${labels[index]} sent`);
    } else {
      console.error(
        `❌ Inquiry ${labels[index]} failed:`,
        result.reason?.message || result.reason,
      );
    }
  });

  return results;
};
