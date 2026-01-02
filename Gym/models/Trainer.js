import mongoose from "mongoose";
import  db2  from "../../config/db2.js";

const trainerSchema = new mongoose.Schema(
  {
    trainername: String,
    experience: String,
    services: String,
    timing: String,
    fees: Number,
    image: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Trainer =
  db2.models.Trainer || db2.model("Trainer", trainerSchema);

export default Trainer;