import connectDB from "../../utils/connectDB";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      const { id, action } = req.body;
      try {
        let updatedUser;
        if (action === "approve") {
          updatedUser = await User.findByIdAndUpdate(
            id,
            { registrationStatus: "approved" },
            { new: true }
          );
        } else if (action === "reject") {
          updatedUser = await User.findByIdAndUpdate(
            id,
            { registrationStatus: "rejected" },
            { new: true }
          );
        }
        res.status(200).json({ success: true, data: updatedUser });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}