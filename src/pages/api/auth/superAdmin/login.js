import connectDB from "../../../../utils/connectDB";
import SuperAdmin from "../../../../models/SuperAdmin";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { emailOrID, password } = req.body;

    // Check if both emailOrID and password are provided
    if (!emailOrID || !password) {
      return res
        .status(400)
        .json({ error: "Email or ID and password are required" });
    }

    try {
      // Determine if emailOrID is an email or ID
      let superAdminData;
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrID)) {
        // Treat as email
        superAdminData = await SuperAdmin.findOne({ email: emailOrID });
      } else {
        // Treat as ID
        superAdminData = await SuperAdmin.findOne({ superAdminID: emailOrID });
      }

      if (!superAdminData) {
        return res.status(404).json({ error: "Super Admin not found" });
      }

      // Verify the password
      const isPasswordValid = await bcryptjs.compare(
        password,
        superAdminData.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: superAdminData._id,
          email: superAdminData.email,
          role: superAdminData.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      // Log the successful login attempt
      console.log({
        message: "Super Admin logged in successfully",
        token,
        superAdminData,
      });

      return res.status(200).json({
        message: "Super Admin logged in successfully",
        token,
        superAdminData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
