import connectDB from "../../../utils/connectDB";
import Slip from "../../../models/Slip";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();
  const slips = await Slip.find({})
    .populate("userId", "firstName lastName email userID userCategory phoneNumber gender institution otherInstitution state otherState campType profilePicture balance")
    .sort({ date: -1 });
  res.status(200).json({
    slips: slips.map((s) => ({
      ...s.toObject(),
      user: s.userId,
    })),
  });
}