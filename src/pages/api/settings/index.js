import connectDB from "../../../utils/connectDB";
import Settings from "../../../models/Settings";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      // Get the most recent settings (there should only be one)
      const settings = await Settings.findOne().sort({ createdAt: -1 });
      
      if (!settings) {
        return res.status(404).json({ 
          message: "No settings found",
          settings: null 
        });
      }

      return res.status(200).json({ 
        success: true,
        settings 
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      return res.status(500).json({ 
        success: false,
        error: "Failed to fetch settings" 
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { 
        portalRegistrationOpen, 
        registrationMessage, 
        paymentDeadline,
        paymentPortalOpen,
        paymentClosedMessage,
        updatedBy 
      } = req.body;

      // Create new settings
      const newSettings = new Settings({
        portalRegistrationOpen: portalRegistrationOpen ?? true,
        registrationMessage: registrationMessage ?? "Portal Has Been Closed For Registration",
        paymentDeadline: paymentDeadline ? new Date(paymentDeadline) : null,
        paymentPortalOpen: paymentPortalOpen ?? true,
        paymentClosedMessage: paymentClosedMessage ?? "Payment portal has been closed. Please contact administrator for assistance.",
        updatedBy: updatedBy || "System",
      });

      await newSettings.save();

      return res.status(201).json({ 
        success: true,
        settings: newSettings 
      });
    } catch (error) {
      console.error("Error creating settings:", error);
      return res.status(500).json({ 
        success: false,
        error: "Failed to create settings" 
      });
    }
  }

  if (req.method === "PUT") {
    try {
      const { 
        portalRegistrationOpen, 
        registrationMessage, 
        paymentDeadline,
        paymentPortalOpen,
        paymentClosedMessage,
        updatedBy 
      } = req.body;

      // Get the most recent settings
      let settings = await Settings.findOne().sort({ createdAt: -1 });

      if (!settings) {
        // Create new settings if none exist
        settings = new Settings({
          portalRegistrationOpen: portalRegistrationOpen ?? true,
          registrationMessage: registrationMessage ?? "Portal Has Been Closed For Registration",
          paymentDeadline: paymentDeadline ? new Date(paymentDeadline) : null,
          paymentPortalOpen: paymentPortalOpen ?? true,
          paymentClosedMessage: paymentClosedMessage ?? "Payment portal has been closed. Please contact administrator for assistance.",
          updatedBy: updatedBy || "System",
        });
      } else {
        // Update existing settings
        settings.portalRegistrationOpen = portalRegistrationOpen ?? settings.portalRegistrationOpen;
        settings.registrationMessage = registrationMessage ?? settings.registrationMessage;
        settings.paymentDeadline = paymentDeadline ? new Date(paymentDeadline) : settings.paymentDeadline;
        settings.paymentPortalOpen = paymentPortalOpen ?? settings.paymentPortalOpen;
        settings.paymentClosedMessage = paymentClosedMessage ?? settings.paymentClosedMessage;
        settings.updatedBy = updatedBy || settings.updatedBy;
        settings.updatedAt = new Date();
      }

      await settings.save();

      return res.status(200).json({ 
        success: true,
        settings 
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      return res.status(500).json({ 
        success: false,
        error: "Failed to update settings" 
      });
    }
  }

  return res.status(405).json({ 
    success: false,
    error: "Method not allowed" 
  });
} 