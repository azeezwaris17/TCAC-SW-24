import connectDB from "../../../utils/connectDB";
import Post from "../../../models/Post";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { posts } = req.body;

    if (!posts || !Array.isArray(posts)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Posts array is required' 
      });
    }

    // Update each post's sortOrder
    const updatePromises = posts.map(({ id, sortOrder }) => 
      Post.findByIdAndUpdate(id, { sortOrder }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({ 
      success: true, 
      message: 'Posts reordered successfully' 
    });

  } catch (error) {
    console.error('Error reordering posts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
} 