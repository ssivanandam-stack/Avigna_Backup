// src/services/s3.service.js
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws.config.js";
import crypto from "crypto";

/**
 * Upload a file to S3
 * @param {Object} file - Multer file object (buffer, originalname, mimetype)
 * @param {string} folder - S3 folder/prefix (e.g., "resumes", "blogs", "resources")
 * @returns {Object} { url, key } - The public URL and S3 key for later deletion
 */
export const uploadFileToS3 = async (file, folder = "misc") => {
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  // Sanitize the original filename so the resulting S3 URL is always a valid URI
  // (spaces, parentheses, and other unsafe characters break URL validation).
  const safeName = (file.originalname || "file")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
  const key = `${folder}/${uniqueSuffix}-${safeName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(params));

  const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { url, key };
};

/**
 * Delete a file from S3 by its key
 * @param {string} key - The S3 object key (e.g., "resumes/1234-abc-resume.pdf")
 * @returns {boolean} true if deleted successfully
 */
export const deleteFileFromS3 = async (key) => {
  if (!key) return false;

  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`🗑️  S3: Deleted ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ S3 Delete Error for key "${key}":`, error.message);
    return false;
  }
};

/**
 * Fetch an object from S3 for streaming through the backend.
 * @param {string} key - The S3 object key
 * @returns {Object} { body, contentType, contentLength } - body is a Readable stream
 */
export const getFileObject = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);

  return {
    body: response.Body,
    contentType: response.ContentType,
    contentLength: response.ContentLength,
  };
};

/**
 * Generate a secure, temporary URL to view a private file
 * @param {string} key - The S3 object key
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {string|null} The pre-signed URL
 */
export const getFileSignedUrl = async (key, expiresIn = 3600) => {
  if (!key) return null;

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    // Generate a URL that will expire in exactly 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error(`❌ S3 Presigned URL Error for key "${key}":`, error.message);
    return null;
  }
};
