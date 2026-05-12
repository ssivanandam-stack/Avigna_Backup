import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../config/aws.config.js";

export const sendAdminNotification = async (inquiryData) => {
  const params = {
    Destination: { ToAddresses: [process.env.ADMIN_EMAIL] },
    Message: {
      Body: {
        Text: {
          Data: `New Inquiry from ${inquiryData.firstName} ${inquiryData.lastName} (${inquiryData.email}):\n\n${inquiryData.message}`,
        },
      },
      Subject: {
        Data: `New Website Inquiry: ${inquiryData.firstName} ${inquiryData.lastName}`,
      },
    },
    Source: process.env.ADMIN_EMAIL,
  };
  return sesClient.send(new SendEmailCommand(params));
};
