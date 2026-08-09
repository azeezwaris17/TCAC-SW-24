import ResetCode from '../models/ResetCode';
import connectDB from './connectDB';

export const storeResetCode = async (email, code) => {
  try {
    await connectDB();
    
    await ResetCode.deleteMany({ email });
    
    const resetCode = new ResetCode({
      email,
      code,
      attempts: 0
    });
    
    await resetCode.save();
  } catch (error) {
    throw error;
  }
};

export const getResetCode = async (email) => {
  try {
    await connectDB();
    
    const resetCode = await ResetCode.findOne({ email });
    
    if (!resetCode) {
      return null;
    }
    
    const timeDiff = Date.now() - resetCode.createdAt.getTime();
    
    if (timeDiff > 15 * 60 * 1000) {
      await ResetCode.deleteOne({ _id: resetCode._id });
      return null;
    }
    
    return resetCode.code;
    
  } catch (error) {
    return null;
  }
};

export const verifyResetCode = async (email, code) => {
  try {
    await connectDB();
    
    const resetCode = await ResetCode.findOne({ email });
    
    if (!resetCode) {
      return false;
    }
    
    const timeDiff = Date.now() - resetCode.createdAt.getTime();
    
    if (timeDiff > 15 * 60 * 1000) {
      await ResetCode.deleteOne({ _id: resetCode._id });
      return false;
    }
    
    if (resetCode.attempts >= 5) {
      await ResetCode.deleteOne({ _id: resetCode._id });
      return false;
    }
    
    resetCode.attempts += 1;
    await resetCode.save();
    
    if (resetCode.code === code) {
      await ResetCode.deleteOne({ _id: resetCode._id });
      return true;
    }
    
    return false;
    
  } catch (error) {
    return false;
  }
};

export const removeResetCode = async (email) => {
  try {
    await connectDB();
    await ResetCode.deleteMany({ email });
  } catch (error) {
  }
};

export const clearExpiredCodes = async () => {
  try {
    await connectDB();
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    await ResetCode.deleteMany({ createdAt: { $lt: fifteenMinutesAgo } });
  } catch (error) {
  }
}; 