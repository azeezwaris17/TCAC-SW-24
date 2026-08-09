import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentType: { type: String, required: true },
    campType: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionDate: { type: Date, required: true },
    receiptUrl: { type: String, required: true },
    paymentNarration: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminComment: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);