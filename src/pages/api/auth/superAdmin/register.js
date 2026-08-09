import connectDB from "../../../../utils/connectDB";
import SuperAdmin from "../../../../models/SuperAdmin";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    // console.log("Incoming request body:", req.body); // Log the incoming request body

    const { email, password } = req.body;

    console.log("Destructured form values:", email, password); // Log the destructured values

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Check if super admin already exists
      const existingSuperAdmin = await SuperAdmin.findOne({ email });

      if (existingSuperAdmin) {
        return res.status(409).json({ error: "Super Admin already exists" });
      }

      // Generate unique ID for new admin
      const superAdminID = await generateSuperAdminID();

      // Hash the password
      const hashedPassword = await bcryptjs.hash(password, 12);

      // Create new admin
      const newSuperAdmin = new SuperAdmin({
        ...req.body,  
        password: hashedPassword,
        superAdminID,
      });

      // Save the new admin to the database
      await newSuperAdmin.save();

      console.log("Registered Super Admin Details:", newSuperAdmin);

      // Respond with success message
      return res.status(201).json({
        message: "Super Admin registered successfully",
        newSuperAdmin,
      });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}



// Utility function to generate unique ID for Admin
async function generateSuperAdminID() {
  try {
    const lastSuperAdmin = await SuperAdmin.findOne()
      .sort({ $natural: -1 })
      .limit(1);
    if (lastSuperAdmin) {
      const lastSuperAdminID = lastSuperAdmin.superAdminID;
      const lastCounter = parseInt(lastSuperAdminID.split("-")[2]);
      const paddedCounter = (lastCounter + 1).toString().padStart(3, "0");
      return `TCAC'25-SADM-${paddedCounter}`;
    } else {
      // If there are no admins in the database yet
      return `TCAC'25-SADM-001`;
    }
  } catch (error) {
    console.error("Error generating super admin ID:", error);
    throw new Error("Failed to generate super admin ID for admin");
  }
}
