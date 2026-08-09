import connectDB from "../../../utils/connectDB";
import Settings from "../../../models/Settings";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      // Get the most recent settings
      const settings = await Settings.findOne().sort({ createdAt: -1 });
      
      if (!settings) {
        // If no settings exist, registration is open by default
        return res.status(200).json({ 
          success: true,
          portalRegistrationOpen: true,
          registrationMessage: "Portal Has Been Closed For Registration"
        });
      }

      return res.status(200).json({ 
        success: true,
        portalRegistrationOpen: settings.portalRegistrationOpen,
        registrationMessage: settings.registrationMessage
      });
    } catch (error) {
      console.error("Error checking registration status:", error);
      return res.status(500).json({ 
        success: false,
        error: "Failed to check registration status",
        portalRegistrationOpen: true // Default to open on error
      });
    }
  }

  return res.status(405).json({ 
    success: false,
    error: "Method not allowed" 
  });
} 