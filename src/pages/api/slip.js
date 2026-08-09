import connectDB from "../../utils/connectDB";
import Slip from "../../models/Slip";

function generateSlipCode() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
}

export default async function handler(req, res) {
  await connectDB();
  const { userId } = req.body;

  let slip = await Slip.findOne({ userId });
  if (!slip) {
    let slipCode;
    let exists = true;
    while (exists) {
      slipCode = generateSlipCode();
      exists = await Slip.findOne({ slipCode });
    }
    slip = await Slip.create({ userId, slipCode });
  }
  res.status(200).json({ slipCode: slip.slipCode });
}