import connectDB from "../../../utils/connectDB";
import Notification from "../../../models/Notification";

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Notification ID is required' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { title, message, type, isActive } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (message !== undefined) updateData.message = message;
        if (type !== undefined) updateData.type = type;
        if (isActive !== undefined) updateData.isActive = isActive;

        const notification = await Notification.findByIdAndUpdate(
          id,
          { ...updateData, updatedAt: new Date() },
          { new: true }
        );

        if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: notification });
      } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ success: false, message: 'Failed to update notification' });
      }
      break;

    case 'DELETE':
      try {
        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, message: 'Notification deleted successfully' });
      } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
  }
} 