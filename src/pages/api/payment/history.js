import connectDB from "../../../utils/connectDB";
import Payment from "../../../models/Payment";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // Auth: require bearer token and authorize owner/admin
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const isAdmin = decoded.role === "admin" || decoded.role === "superAdmin";
    const isOwner = decoded.id === userId;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json({ payments });
}