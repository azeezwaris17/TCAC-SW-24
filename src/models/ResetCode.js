import mongoose from 'mongoose';

const resetCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900 // Document expires after 15 minutes (900 seconds)
  }
});

// Create a compound index for email and createdAt for efficient queries
resetCodeSchema.index({ email: 1, createdAt: 1 });

const ResetCode = mongoose.models.ResetCode || mongoose.model('ResetCode', resetCodeSchema);

export default ResetCode; 