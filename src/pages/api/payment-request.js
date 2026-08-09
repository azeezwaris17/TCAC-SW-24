import connectDB from "../../utils/connectDB";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.paymentRequestMessage = message;
      user.paymentRequestDate = new Date();
      user.paymentRequestStatus = "pending";
      await user.save();

      return res.status(200).json({ 
        success: true, 
        message: "Payment request submitted successfully" 
      });
    } catch (error) {
      console.error("Error submitting payment request:", error);
      return res.status(500).json({ error: "Failed to submit payment request" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
} 