import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  postType: { 
    type: String, 
    required: true,
    enum: [
      "Header and Paragraph", 
      "Video Embed",
      "Popout/Modal",
      "Gallery",
      "Banner",
      "Slider"
    ]
  },
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  sortOrder: { 
    type: Number, 
    default: 0 
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

let Post;

try {
  // Attempt to use the existing model if it's already compiled
  Post = mongoose.model('Post');
} catch (e) {
  // If not compiled, compile the model
  Post = mongoose.model('Post', PostSchema);
}

export default Post;