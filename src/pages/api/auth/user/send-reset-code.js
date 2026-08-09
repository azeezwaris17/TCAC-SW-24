import nodemailer from 'nodemailer';
import User from "../../../../models/User";
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

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
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
      subject: 'Your Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    });
    res.status(200).json({ message: 'Reset code sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reset code' });
  }
}