import SuperAdmin from "../../../../models/SuperAdmin";
import connectDB from "../../../../utils/connectDB";
import bcryptjs from "bcryptjs";
import { verifyResetCode, getResetCode } from "../../../../utils/resetCodeStore";

export default async function handler(req, res) {
  await connectDB();
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    return res.status(400).json({ message: 'Email, code, and password are required' });
  }
  try {
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }
    const storedCode = await getResetCode(email);
    const isCodeValid = await verifyResetCode(email, code);
    if (!isCodeValid) {
      return res.status(400).json({ message: 'Incorrect reset code' });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    superAdmin.password = hashedPassword;
    await superAdmin.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
} 