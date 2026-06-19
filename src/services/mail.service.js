import transporter from "../config/nodemailer.config.js";

const extractEmail = (address) => {
  const match = String(address).match(/<([^>]+)>/);
  return match ? match[1] : address;
};

const getGraphToken = async () => {
  const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env;
  if (!AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
    return null;
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: AZURE_CLIENT_ID,
        client_secret: AZURE_CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Graph token request failed (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.access_token;
};

const sendViaGraph = async ({
  token,
  from,
  to,
  subject,
  html,
  text,
  replyTo,
}) => {
  const message = {
    subject,
    body: {
      contentType: html ? "HTML" : "Text",
      content: html || text || "",
    },
    toRecipients: [{ emailAddress: { address: to } }],
  };

  if (replyTo) {
    message.replyTo = [{ emailAddress: { address: replyTo } }];
  }

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(from)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, saveToSentItems: true }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Graph sendMail failed (${response.status}): ${error}`);
  }

  console.log(`✉️  Email sent via Graph: "${subject}" → ${to}`);
};

export const sendMail = async ({
  from,
  to,
  subject,
  html,
  text,
  replyTo,
}) => {
  const senderMailbox = extractEmail(from);

  try {
    const token = await getGraphToken();
    if (token) {
      await sendViaGraph({
        token,
        from: senderMailbox,
        to,
        subject,
        html,
        text,
        replyTo,
      });
      return;
    }
  } catch (error) {
    console.warn("Graph email failed, falling back to SMTP:", error.message);
  }

  return transporter.sendMail({ from, to, subject, html, text, replyTo }).then(
    () => {
      console.log(`✉️  Email sent via SMTP: "${subject}" → ${to}`);
    },
  );
};
