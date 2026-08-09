import connectDB from "../../utils/connectDB";
import Payment from "../../models/Payment";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const {
      userId,
      paymentType,
      campType,
      amount,
      transactionDate,
      receiptUrl,
      paymentNarration,
      status
    } = req.body;

    if (!userId || !paymentType || !campType || !amount || !transactionDate || !receiptUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) {
      return res.status(400).json({ error: "Amount must be a number" });
    }

    const txDate = new Date(transactionDate);
    if (Number.isNaN(txDate.getTime())) {
      return res.status(400).json({ error: "Invalid transactionDate format" });
    }

    const payment = await Payment.create({
      userId,
      paymentType,
      campType,
      amount: numericAmount,
      transactionDate: txDate,
      receiptUrl,
      paymentNarration,
      status: status || "pending"
    });

    return res.status(200).json({ success: true, payment });
  }

  res.status(405).json({ error: "Method not allowed" });
}