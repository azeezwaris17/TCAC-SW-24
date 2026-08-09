import connectDB from "../../../../utils/connectDB";
import User from "../../../../models/User";
import Payment from "../../../../models/Payment";
import Settings from "../../../../models/Settings";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { role, email, password, userCategory, campType, amount } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Check if this is a user registration (not admin or super admin)
      if (role === "User" || role === "user") {
        // Check portal registration status
        const settings = await Settings.findOne().sort({ createdAt: -1 });
        
        if (settings && !settings.portalRegistrationOpen) {
          return res.status(403).json({ 
            error: settings.registrationMessage || "Portal Has Been Closed For Registration" 
          });
        }
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcryptjs.hash(password, 12);
      const userID = await generateUserID(userCategory);

      // Calculate balance based on camp type and amount paid
      let balance = 0;
      const amountPaid = parseInt(amount);
      
      if (userCategory === "Child") {
        // Children only get Camp Only with 50% discount
        const campPrice = 3500; // 50% of ₦7,000
        balance = Math.max(0, campPrice - amountPaid);
      } else {
        switch (campType) {
          case "Camp Only":
            const campPrice = 7000;
            balance = Math.max(0, campPrice - amountPaid);
            break;
          case "Conference Only":
            const conferencePrice = 35000;
            balance = Math.max(0, conferencePrice - amountPaid);
            break;
          case "Camp + Conference":
            const totalPrice = 42000; // ₦7,000 + ₦35,000
            balance = Math.max(0, totalPrice - amountPaid);
            break;
          default:
            balance = 0;
        }
      }

      const newUser = new User({
        ...req.body,
        password: hashedPassword,
        userID,
        registrationStatus: "pending",
        balance, 
      });

      await newUser.save();
      console.log("New User Saved:", newUser);

      // Create a Payment record for the registration payment
      if (amount && parseInt(amount) > 0) {
        const registrationPayment = new Payment({
          userId: newUser._id,
          paymentType: req.body.paymentType || "Full Payment",
          campType: campType,
          amount: parseInt(amount),
          transactionDate: new Date(),
          receiptUrl: req.body.receiptUrl || "",
          paymentNarration: req.body.paymentNarration || "Registration payment",
          status: "approved", // Registration payments are automatically approved
          adminComment: "Registration payment"
        });

        await registrationPayment.save();
        console.log("Registration Payment Saved:", registrationPayment);
      }

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

function getCategoryID(userCategory) {
  switch (userCategory.toLowerCase()) {
    case "student":
      return "STD";
    case "alumnus":
      return "IOTB";
    case "children":
      return "CHLD";
    case "nontimsanite":
      return "NTMS";
    default:
      return "";
  }
}

function generateParticipantID(abbreviation, counter) {
  const paddedCounter = counter.toString().padStart(3, "0");
  return `${abbreviation}${paddedCounter}`;
}

async function generateUserID(userCategory) {
  const categoryID = getCategoryID(userCategory);
  const houseAbbreviations = ["ABU", "UMR", "UTH", "ALI"];

  const lastUser = await User.findOne().sort({ $natural: -1 }).limit(1);

  let participantID;
  let participantIDCounter = 1;

  if (lastUser && lastUser.userID) {
    const lastParticipantID = lastUser.userID.split("-").pop();
    const lastAbbreviation = lastParticipantID.substring(0, 3);
    const lastCounter = parseInt(lastParticipantID.substring(3), 10);

    if (lastAbbreviation === "ALI") {
      participantIDCounter = lastCounter + 1;
      participantID = generateParticipantID("ABU", participantIDCounter);
    } else {
      const lastIndex = houseAbbreviations.indexOf(lastAbbreviation);
      const nextIndex = (lastIndex + 1) % houseAbbreviations.length;
      const nextAbbreviation = houseAbbreviations[nextIndex];
      participantID = generateParticipantID(nextAbbreviation, lastCounter);
    }
  } else {
    participantID = generateParticipantID("ABU", participantIDCounter);
  }

  return `TCAC'25-${categoryID}-${participantID}`;
}