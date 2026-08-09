import connectDB from "../../utils/connectDB";
import Payment from "../../models/Payment";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(payments);
  }

  res.status(405).json({ error: "Method not allowed" });
}