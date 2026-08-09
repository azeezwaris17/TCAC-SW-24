// src/pages/api/user/auth/reset-password.js
import Admin from "../../../../models/Admin";
import connectDB from "../../../../utils/connectDB";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  // Check if the request method is POST
  if (req.method === "POST") {
    // Extract email and password from the request body
    const { email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
      // Find the admin by email
      const admin = await Admin.findOne({ email });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Hash the new password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Update the admin's password
      admin.password = hashedPassword;
      await admin.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
