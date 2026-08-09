import connectDB from "../../../utils/connectDB";
import Notification from "../../../models/Notification";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        let query = { isActive: true };
        
        const notifications = await Notification.find(query)
          .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: notifications });
      } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
      }
      break;

    case 'POST':
      try {
        const { title, message, type } = req.body;

        if (!title || !message) {
          return res.status(400).json({ success: false, message: 'Title and message are required' });
        }

        const notification = new Notification({
          title,
          message,
          type: type || 'info',
          createdBy: 'admin'
        });

        await notification.save();

        res.status(201).json({ success: true, data: notification });
      } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ success: false, message: 'Failed to create notification' });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
  }
} 