import connectDB from "../../utils/connectDB";
import Activity from "../../models/Activity";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const activities = await Activity.find({});
        res.status(200).json({ success: true, data: activities });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const activity = await Activity.create(req.body);
        res.status(201).json({ success: true, data: activity });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      try {
        const { id, ...updateData } = req.body;
        const updated = await Activity.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ success: true, data: updated });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        await Activity.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Deleted successfully" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}