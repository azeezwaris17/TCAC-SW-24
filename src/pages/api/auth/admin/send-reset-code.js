import nodemailer from 'nodemailer';
import Admin from "../../../../models/Admin";
import connectDB from "../../../../utils/connectDB";
import { storeResetCode } from "../../../../utils/resetCodeStore";

export default async function handler(req, res) {
  await connectDB();
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await storeResetCode(email, resetCode);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Admin Password Reset Code',
      text: `Your admin password reset code is: ${resetCode}`,
    });
    res.status(200).json({ message: 'Reset code sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reset code' });
  }
} 