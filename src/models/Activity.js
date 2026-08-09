import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  facilitator: { type: String, required: true },
  description: { type: String },
});

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);