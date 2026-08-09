import Meal from "@/models/Meal";
import connectDB from "@/utils/connectDB";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { name, type, day, startTime, endTime, description } = req.body;
    if (!name || !type || !day || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields are required" });
    }
    try {
      const meal = await Meal.create({ name, type, day, startTime, endTime, description });
      console.log("Meal created:", meal);
      return res.status(201).json({ message: `${meal.name} created successfully`, meal });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      const meals = await Meal.find();
      return res.status(200).json(meals);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    const { id, ...update } = req.body;
    try {
      const meal = await Meal.findByIdAndUpdate(id, update, { new: true });
      return res.status(200).json(meal);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await Meal.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}