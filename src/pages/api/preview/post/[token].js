import connectDB from "../../../../utils/connectDB";
import Post from "../../../../models/Post";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { token, postId } = req.query;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Token required" });
    }

    if (!postId) {
      return res.status(400).json({ success: false, message: "Post ID required" });
    }

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
} 