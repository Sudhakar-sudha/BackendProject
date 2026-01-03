import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db1 = mongoose.createConnection(process.env.MONGO_URI1);

db1.on("connected", () => {
  console.log("✅ DB1 Connected");
});

db1.on("error", (err) => {
  console.error("❌ DB1 Error:", err);
});

export default db1;
