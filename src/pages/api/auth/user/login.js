import connectDB from "../../../../utils/connectDB";
import User from "../../../../models/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { emailOrID, password } = req.body;

    if (!emailOrID || !password) {
      return res
        .status(400)
        .json({ error: "Email or ID and password are required" });
    }

    try {
      let userData;
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrID)) {
        userData = await User.findOne({ email: emailOrID });
      } else {
        userData = await User.findOne({ UserID: emailOrID });
      }

      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcryptjs.compare(password, userData.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: userData._id,
          email: userData.email,
          role: userData.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token, user: userData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
