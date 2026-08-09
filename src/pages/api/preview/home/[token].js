import connectDB from "../../../../utils/connectDB";
import Post from "../../../../models/Post";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { token, page: pageQuery, limit: limitQuery } = req.query;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Token required" });
    }

    const page = parseInt(pageQuery, 10) || 1;
    const limit = parseInt(limitQuery, 10) || 5;
    const skip = (page - 1) * limit;

    // No filtering by token, but you can add logic if needed
    const [posts, total] = await Promise.all([
      Post.find({})
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({})
    ]);
    res.status(200).json({ success: true, data: posts, total, page, limit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
} 