import connectDB from "../../../utils/connectDB";
import Payment from "../../../models/Payment";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { status, search } = req.query;
    let filter = {};
    
    if (status && status !== "all") {
      filter.status = status;
    }
    
    try {
      let payments;
      
      if (search && search.trim()) {
        // Use aggregation to search through populated user fields
        const searchTerms = search.trim().split(/\s+/).filter(term => term.length > 0);
        const searchConditions = [];
        
        // Create search conditions for each term - ALL terms must match
        searchTerms.forEach(term => {
          const searchRegex = new RegExp(term, 'i');
          searchConditions.push({
            $or: [
              { 'userData.firstName': searchRegex },
              { 'userData.lastName': searchRegex }
            ]
          });
        });
        
        payments = await Payment.aggregate([
          {
            $lookup: {
              from: 'users', // MongoDB collection name for User model
              localField: 'userId',
              foreignField: '_id',
              as: 'userData'
            }
          },
          {
            $unwind: '$userData'
          },
          {
            $match: {
              $and: searchConditions,
              ...(status && status !== "all" ? { status: status } : {})
            }
          },
          {
            $addFields: {
              userId: '$userData'
            }
          },
          {
            $project: {
              userData: 0,
              'userId.password': 0,
              'userId.__v': 0
            }
          },
          {
            $sort: { createdAt: -1 }
          }
        ]);
      } else {
        // No search, use regular populate
        payments = await Payment.find(filter)
          .populate({ path: "userId", select: "firstName lastName" })
          .sort({ createdAt: -1 });
      }
      
      return res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      return res.status(500).json({ error: "Failed to fetch payments" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}