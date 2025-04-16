import mongoose from 'mongoose';
import Donation from "../models/Donation.js";
import Cause from "../models/cause.model.js";

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    console.log("=== Donation creation started ===")
    console.log("Request body:", JSON.stringify(req.body, null, 2))

    const {
      causeId,
      amount,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      paymentMethod,
      isAnonymous,
      message,
      paymentDetails,
    } = req.body

    // Validate required fields
    if (!causeId) {
      console.log("Missing causeId")
      return res.status(400).json({ message: "Missing causeId" })
    }

    if (!amount) {
      console.log("Missing amount")
      return res.status(400).json({ message: "Missing amount" })
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create and save donation
      const donation = new Donation({
        cause: causeId,
        amount: Number(amount),
        donor: {
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          address: address || undefined,
          city: city || undefined,
          country: country || undefined,
        },
        paymentMethod: paymentMethod || "card",
        isAnonymous: isAnonymous || false,
        message: message || undefined,
        status: "completed",
        paymentDetails: {
          last4: paymentDetails?.last4 || "1234",
          cardName: paymentDetails?.cardName || firstName + " " + lastName,
        },
        transactionId: "txn_" + Date.now() + Math.random().toString(36).substring(2, 15),
      });

      await donation.save({ session });

      // Find and update the cause
      const cause = await Cause.findById(causeId).session(session);
      if (!cause) {
        throw new Error("Cause not found");
      }

      // Update the cause's current amount
      cause.currentAmount = Number(cause.currentAmount || 0) + Number(amount);
      await cause.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      console.log("Donation created successfully:", {
        donationId: donation._id,
        amount: amount,
        causeId: causeId,
        newTotal: cause.currentAmount
      });

      res.status(201).json({ 
        success: true, 
        donation,
        updatedCauseAmount: cause.currentAmount
      });

    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }

  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create donation",
      error: error.message 
    });
  }
}

// Get donations for a specific cause
export const getDonationsByCause = async (req, res) => {
  try {
    const { causeId } = req.params
    console.log("=== Fetching donations for cause ===")
    console.log("CauseId:", causeId)

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected! Connection state:", mongoose.connection.readyState)
      // Return error instead of mock data
      return res.status(500).json({
        message: "Database connection error",
        details: "MongoDB is not connected. Please check your database connection.",
      })
    }

    // Get donations for this cause
    console.log("Executing database query for donations...")
    const donations = await Donation.find({ cause: causeId }).sort({ createdAt: -1 })
    console.log(`Found ${donations.length} donations for cause ${causeId}`)

    // Format the response to protect donor privacy
    const formattedDonations = donations.map((donation) => {
      // Convert Mongoose document to plain object
      const donationObj = donation.toObject ? donation.toObject() : donation
      const { donor, ...rest } = donationObj

      // If donation is anonymous, only return that it's anonymous
      if (donationObj.isAnonymous) {
        return {
          ...rest,
          donor: { isAnonymous: true },
        }
      }

      // Otherwise return first name and last initial
      return {
        ...rest,
        donor: {
          firstName: donor?.firstName || "Anonymous",
          lastName: donor?.lastName ? donor.lastName.charAt(0) + "." : "",
          isAnonymous: false,
        },
      }
    })

    console.log("Sending response with formatted donations")
    return res.json(formattedDonations)
  } catch (error) {
    console.error("Error fetching cause donations:", error)

    // Return error instead of mock data
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Get all donations (admin only)
export const getAllDonations = async (req, res) => {
  try {
    console.log("=== Fetching all donations ===")

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected! Connection state:", mongoose.connection.readyState)
      return res.status(500).json({
        message: "Database connection error",
        details: "MongoDB is not connected. Please check your database connection.",
      })
    }

    const donations = await Donation.find()
      .populate("cause", "title") // Populate cause with just the title
      .sort({ createdAt: -1 })

    console.log(`Found ${donations.length} total donations`)

    return res.json(donations)
  } catch (error) {
    console.error("Error fetching all donations:", error)
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}

// Get donation by ID
export const getDonationById = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`=== Fetching donation with ID: ${id} ===`)

    const donation = await Donation.findById(id).populate("cause", "title")

    if (!donation) {
      console.log(`Donation with ID ${id} not found`)
      return res.status(404).json({ message: "Donation not found" })
    }

    console.log("Donation found:", donation._id)
    return res.json(donation)
  } catch (error) {
    console.error("Error fetching donation by ID:", error)
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}

// Get donations by user email
export const getDonationsByUser = async (req, res) => {
  try {
    console.log("=== Fetching donations for user ===")

    // Get user email from the authenticated user
    const userEmail = req.user?.email

    if (!userEmail) {
      console.log("No authenticated user found")
      return res.status(401).json({ message: "Authentication required" })
    }

    console.log("User email:", userEmail)

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected! Connection state:", mongoose.connection.readyState)
      return res.status(500).json({
        message: "Database connection error",
        details: "MongoDB is not connected. Please check your database connection.",
      })
    }

    // Find donations where the donor email matches the user's email
    const donations = await Donation.find({ "donor.email": userEmail })
      .populate("cause", "title") // Populate cause with just the title
      .sort({ createdAt: -1 })

    console.log(`Found ${donations.length} donations for user ${userEmail}`)

    return res.json(donations)
  } catch (error) {
    console.error("Error fetching user donations:", error)
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}

// Test function to verify controller is working
export const testDonationController = (req, res) => {
  console.log("Donation controller test function called")
  return res.json({
    message: "Donation controller is working!",
    timestamp: new Date().toISOString(),
  })
}

const getUserDonations = async (req, res) => {
  try {
    const donations = await DonationModel
      .find({ donor: req.user._id })
      .populate({
        path: 'cause',
        select: 'title description category image shareUrl _id'
      })
      .sort({ createdAt: -1 });

    // If cause doesn't have shareUrl, generate it
    donations.forEach(donation => {
      if (donation.cause && !donation.cause.shareUrl) {
        donation.cause.shareUrl = `${donation.cause.title.toLowerCase().replace(/\s+/g, '-')}-${donation.cause._id}`;
      }
    });

    res.json(donations);
  } catch (error) {
    console.error("Error fetching user donations:", error);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};
