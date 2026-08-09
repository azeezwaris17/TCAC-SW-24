// pages/api/posts/published.js
import connectDB from "../../../utils/connectDB";
import Post from "../../../models/Post";
import { sanitizePost } from "../../../utils/sanitizePost";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 2, 3);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ isPublished: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("name postType isPublished sortOrder content createdAt updatedAt")
        .lean(),
      Post.countDocuments({ isPublished: true })
    ]);

    // FIXED: Serialize ObjectIds + Dates to match SSR exactly
    const sanitized = posts.map((p) => ({
      ...sanitizePost(p),
      _id: p._id.toString(),
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null
    }));

    res.status(200).json({ 
      success: true, 
      data: sanitized, 
      total, 
      page, 
      limit 
    });

  } catch (error) {
    console.error('API posts fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch posts" 
    });
  }
}
