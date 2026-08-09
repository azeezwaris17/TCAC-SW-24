// src/pages/api/user/auth/reset-password.js
import SuperAdmin from "../../../../models/SuperAdmin";
import connectDB from "../../../../utils/connectDB";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
      // Find the admin by email
      const superAdmin = await SuperAdmin.findOne({ email });

      if (!superAdmin) {
        return res.status(404).json({ message: "Super Admin not found" });
      }

      // Hash the new password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Update the super admin's password
      superAdmin.password = hashedPassword;
      await superAdmin.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
