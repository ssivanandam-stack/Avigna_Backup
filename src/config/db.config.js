import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(
      "Tip: querySrv/ETIMEOUT usually means DNS/network cannot reach MongoDB Atlas.",
    );
    console.error(
      "Try: check internet/VPN, Atlas Network Access IP allowlist, or use Google DNS (8.8.8.8).",
    );
    process.exit(1);
  }
};

export default connectDB;
