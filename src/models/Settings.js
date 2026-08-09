import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    portalRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationMessage: {
      type: String,
      default: "Portal Has Been Closed For Registration",
    },
    // Payment-related settings
    paymentDeadline: {
      type: Date,
      default: null,
    },
    paymentPortalOpen: {
      type: Boolean,
      default: true,
    },
    paymentClosedMessage: {
      type: String,
      default: "Payment portal has been closed. Please contact administrator for assistance.",
    },
    updatedBy: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema); 