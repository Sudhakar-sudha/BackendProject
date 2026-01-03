import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db2 = mongoose.createConnection(process.env.MONGO_URI2);

db2.on("connected", () => {
  console.log("✅ DB2 Connected");
});

db2.on("error", (err) => {
  console.error("❌ DB2 Error:", err);
});

export default db2;
