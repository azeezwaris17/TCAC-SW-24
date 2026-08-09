import mongoose from "mongoose";

const SlipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  slipCode: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Slip || mongoose.model("Slip", SlipSchema);