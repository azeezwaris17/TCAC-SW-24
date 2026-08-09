import connectDB from "../../utils/connectDB";
import Settings from "../../models/Settings";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      // Get current settings
      const settings = await Settings.findOne().sort({ createdAt: -1 });
      
      if (!settings || !settings.paymentDeadline) {
        return res.status(200).json({ 
          message: "No payment deadline set",
          usersChecked: 0 
        });
      }

      const now = new Date();
      const deadline = new Date(settings.paymentDeadline);

      // Check if deadline has passed
      if (now < deadline) {
        return res.status(200).json({ 
          message: "Payment deadline has not passed yet",
          deadline: deadline.toISOString(),
          usersChecked: 0 
        });
      }

      // Find users with outstanding balance who haven't been granted payment access
      // and don't have approved payment requests
      const usersWithBalance = await User.find({
        balance: { $gt: 0 },
        paymentAccessGranted: { $ne: true },
        paymentRequestStatus: { $ne: "approved" },
        role: "user" // Only check regular users, not admins
      });

      let usersUpdated = 0;

      // Update users to revoke payment access (this will be checked during login)
      for (const user of usersWithBalance) {
        // The actual logout will be handled during login attempts
        // Here we just ensure the payment access is revoked
        user.paymentAccessGranted = false;
        await user.save();
        usersUpdated++;
      }

      return res.status(200).json({ 
        success: true,
        message: `Payment deadline check completed. ${usersUpdated} users with outstanding balance found.`,
        usersChecked: usersWithBalance.length,
        usersUpdated,
        deadline: deadline.toISOString()
      });

    } catch (error) {
      console.error("Error checking payment deadline:", error);
      return res.status(500).json({ 
        error: "Failed to check payment deadline" 
      });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
} 