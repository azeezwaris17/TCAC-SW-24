import connectDB from "../../../utils/connectDB";
import Post from "../../../models/Post";

// Configure API to handle larger payloads for slider content
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const posts = await Post.find({}).sort({ sortOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const { name, postType, isPublished, content } = req.body;
        
        const maxSortOrder = await Post.findOne().sort({ sortOrder: -1 });
        const newSortOrder = maxSortOrder ? maxSortOrder.sortOrder + 1 : 0;
        
        const post = await Post.create({
          name,
          postType,
          isPublished,
          content,
          sortOrder: newSortOrder
        });
        
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      try {
        const { id, ...updateData } = req.body;
        const updated = await Post.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ success: true, data: updated });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        await Post.findByIdAndDelete(id);
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