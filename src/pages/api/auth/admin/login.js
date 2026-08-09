import connectDB from "../../../../utils/connectDB";
import Admin from "../../../../models/Admin";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  // Check if the request method is POST
  if (req.method === "POST") {
    // Extract email or ID and password from the request body
    const { emailOrID, password } = req.body;

    // Check if both emailOrID and password are provided
    if (!emailOrID || !password) {
      return res
        .status(400)
        .json({ error: "Email or ID and password are required" });
    }

    try {
      // Determine if emailOrID is an email or ID
      let adminData;
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrID)) {
        // Treat as email
        adminData = await Admin.findOne({ email: emailOrID });
      } else {
        // Treat as ID
        adminData = await Admin.findOne({ AdminID: emailOrID });
      }

      if (!adminData) {
        return res.status(404).json({ error: " Admin not found" });
      }

      // Verify the password
      const isPasswordValid = await bcryptjs.compare(
        password,
        adminData.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: adminData._id,
          email: adminData.email,
          role: adminData.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      // Log the successful login attempt
      console.log({
        message: "Admin logged in successfully",
        token,
        adminData,
      });

      // Return the JWT token and admin data to the client
      return res
        .status(200)
        .json({ message: "Admin logged in successfully", token, adminData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
