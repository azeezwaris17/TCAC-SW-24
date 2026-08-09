import mongoose from "mongoose";

const DaySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
});

export default mongoose.models.Day || mongoose.model("Day", DaySchema);