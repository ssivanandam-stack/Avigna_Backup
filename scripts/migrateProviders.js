import mongoose from "mongoose";
import dotenv from "dotenv";
import Provider from "../src/models/Provider.js";

dotenv.config();

/**
 * Ensures Provider collection indexes exist.
 * MongoDB creates the collection automatically on first insert — this script
 * only syncs indexes defined on the Provider schema.
 */
const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Provider.syncIndexes();
  const indexes = await Provider.collection.indexes();

  console.log("✅ Provider indexes synced:");
  indexes.forEach((index) => {
    console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
  });

  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Provider migration failed:", err.message);
  process.exit(1);
});
