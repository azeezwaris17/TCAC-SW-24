import connectDB from "../../../utils/connectDB";
import Notification from "../../../models/Notification";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Create a test notification if none exist
    const existingNotifications = await Notification.find({});
    
    if (existingNotifications.length === 0) {
      const testNotification = new Notification({
        title: "Welcome to TIMSAN!",
        message: "This is a test notification to verify the system is working properly.",
        type: "info",
        isActive: true,
        createdBy: "system"
      });
      
      await testNotification.save();
      res.status(200).json({ 
        success: true, 
        message: "Test notification created successfully",
        data: testNotification
      });
    } else {
      res.status(200).json({ 
        success: true, 
        message: "Notifications already exist",
        count: existingNotifications.length
      });
    }
  } catch (error) {
    console.error('Test API Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Test failed',
      error: error.message 
    });
  }
} 