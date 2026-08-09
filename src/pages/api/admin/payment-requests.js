import connectDB from "../../../utils/connectDB";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const users = await User.find({
        paymentRequestStatus: { $in: ["pending", "approved", "rejected", "revoked"] }
      }).select("firstName lastName email userID balance paymentRequestMessage paymentRequestDate paymentRequestStatus paymentAccessGranted");
      
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching payment requests:", error);
      return res.status(500).json({ error: "Failed to fetch payment requests" });
    }
  }

  if (req.method === "PUT") {
    const { userId, action, adminComment } = req.body;

    if (!userId || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (action === "approve") {
        user.paymentRequestStatus = "approved";
        user.paymentAccessGranted = true;
      } else if (action === "reject") {
        user.paymentRequestStatus = "rejected";
        user.paymentAccessGranted = false;
      } else if (action === "revoke") {
        user.paymentRequestStatus = "revoked";
        user.paymentAccessGranted = false;
      }

      if (adminComment) {
        user.paymentRequestMessage = adminComment;
      }

      await user.save();

      return res.status(200).json({ 
        success: true, 
        message: `Payment access ${action}d successfully` 
      });
    } catch (error) {
      console.error("Error updating payment request:", error);
      return res.status(500).json({ error: "Failed to update payment request" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
} 