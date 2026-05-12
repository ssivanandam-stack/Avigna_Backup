import multer from "multer";
// Store file in memory so we can push it directly to AWS S3 without saving to disk
const storage = multer.memoryStorage();
export const upload = multer({ storage });
