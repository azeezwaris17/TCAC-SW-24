import connectDB from "../../utils/connectDB";
import Day from "../../models/Day";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const days = await Day.find({});
      res.status(200).json({ success: true, data: days });
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch days" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ success: false, message: "Name required" });
      const newDay = await Day.create({ name, description: description || "" });
      res.status(201).json({ success: true, data: newDay });
    } catch {
      res.status(500).json({ success: false, message: "Failed to add day" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, name, description } = req.body;
      if (!id || !name) return res.status(400).json({ success: false, message: "ID and name required" });
      const updated = await Day.findByIdAndUpdate(id, { name, description }, { new: true });
      res.status(200).json({ success: true, data: updated });
    } catch {
      res.status(500).json({ success: false, message: "Failed to update day" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ success: false, message: "ID required" });
      await Day.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ success: false, message: "Failed to delete day" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}