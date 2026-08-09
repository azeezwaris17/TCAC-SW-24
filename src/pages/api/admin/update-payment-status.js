import connectDB from "../../../utils/connectDB";
import Payment from "../../../models/Payment";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, status, adminComment, userId, amount } = req.body;

  if (!paymentId || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    payment.status = status;
    payment.adminComment = adminComment || "";
    await payment.save();

    if (status === "approved" && userId && amount) {
      await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            balance: -Number(amount)
          }
        },
        { new: true }
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update payment" });
  }
}