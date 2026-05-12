import { S3Client } from "@aws-sdk/client-s3";
import { SESClient } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config();

const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

// Initialize S3 Client for uploads (Resources, Blogs, Products)
export const s3Client = new S3Client(awsConfig);

// Initialize SES Client for sending emails (Contact Inquiries)
export const sesClient = new SESClient(awsConfig);
