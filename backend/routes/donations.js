import express from "express"
import mongoose from "mongoose"

// Import the Donation model with a different name to avoid conflicts
import DonationModel from "../models/Donation.js"

console.log("DonationModel type:", typeof DonationModel)
console.log("DonationModel:", DonationModel)

const router = express.Router()

// Simple test route
router.get("/test", (req, res) => {
  console.log("Donations test route hit")
  res.json({
    message: "Donations API is working!",
    mongodbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    donationModelType: typeof DonationModel,
  })
})

// Add a debug route to check database status and donations
router.get("/debug", async (req, res) => {
  try {
    console.log("=== Debug route hit ===")

    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    console.log("MongoDB status:", mongoStatus)
    console.log("DonationModel type:", typeof DonationModel)

    // Return basic debug info without trying to query the database
    res.json({
      mongoStatus,
      donationModelType: typeof DonationModel,
      donationModel: DonationModel ? JSON.stringify(DonationModel) : null,
    })
  } catch (error) {
    console.error("Error in debug route:", error)
    res.status(500).json({ error: error.message })
  }
})

// Create a new donation
router.post("/", async (req, res) => {
  try {
    console.log("=== Donation POST request received ===")
    console.log("Body:", JSON.stringify(req.body, null, 2))

    // In the POST route handler, add more detailed logging for the causeId

    // Add these lines after the initial request logging:
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

    console.log("=== DONATION DETAILS ===")
    console.log("CauseId:", causeId)
    console.log("Amount:", amount)
    console.log("Donor:", `${firstName} ${lastName} (${email})`)

    // Also add validation to ensure causeId is a valid MongoDB ObjectId
    if (!causeId || !mongoose.Types.ObjectId.isValid(causeId)) {
      console.log("Invalid causeId:", causeId)
      return res.status(400).json({ message: "Invalid causeId format" })
    }

    // Validate required fields
    if (!causeId) {
      console.log("Missing causeId")
      return res.status(400).json({ message: "Missing causeId" })
    }

    if (!amount) {
      console.log("Missing amount")
      return res.status(400).json({ message: "Missing amount" })
    }

    if (!firstName || !lastName || !email) {
      console.log("Missing donor information")
      return res.status(400).json({ message: "Missing donor information" })
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected! Connection state:", mongoose.connection.readyState)
      return res.status(500).json({
        message: "Database connection error",
        details: "MongoDB is not connected. Please check your database connection.",
      })
    }

    // Check if DonationModel model is properly defined
    if (typeof DonationModel !== "function" || typeof DonationModel.find !== "function") {
      console.error("DonationModel model is not properly defined:", DonationModel)
      return res.status(500).json({
        message: "Server configuration error",
        details: "The DonationModel model is not properly defined.",
      })
    }

    // Create donation record
    console.log("Creating donation document...")
    const donation = new DonationModel({
      cause: causeId,
      amount: Number.parseFloat(amount),
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
      status: "completed", // In a real app, this would be 'pending' until payment confirmation
      paymentDetails: {
        last4: paymentDetails?.last4 || "1234",
        cardName: paymentDetails?.cardName || firstName + " " + lastName,
      },
      transactionId: "txn_" + Date.now() + Math.random().toString(36).substring(2, 15),
    })

    console.log("Donation object created:", JSON.stringify(donation, null, 2))

    // Save donation to database
    console.log("Attempting to save donation to database...")
    const savedDonation = await donation.save()
    console.log("✅ Donation saved successfully to database!")
    console.log("Donation ID:", savedDonation._id)

    // Return success response
    return res.status(201).json({
      message: "Donation successful",
      donation: {
        id: savedDonation._id,
        amount: savedDonation.amount,
        date: savedDonation.createdAt,
        transactionId: savedDonation.transactionId,
      },
    })
  } catch (error) {
    console.error("❌ Error creating donation:", error)

    // Handle specific errors
    if (error.name === "ValidationError") {
      console.error("Validation error details:", error.errors)
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      })
    }

    if (error.code === 11000) {
      console.error("Duplicate key error:", error.keyValue)
      return res.status(400).json({
        message: "Duplicate key error",
        duplicateKey: error.keyValue,
      })
    }

    // Generic error response
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// Get all donations (admin only)
router.get("/", async (req, res) => {
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

    // Check if DonationModel model is properly defined
    if (typeof DonationModel !== "function" || typeof DonationModel.find !== "function") {
      console.error("DonationModel model is not properly defined:", DonationModel)
      return res.status(500).json({
        message: "Server configuration error",
        details: "The DonationModel model is not properly defined.",
      })
    }

    // In a real app, you would check if the user is an admin here
    // For example: if (!req.user.isAdmin) return res.status(403).json({ message: "Unauthorized" })

    const donations = await DonationModel.find()
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
})

// Get donations for a specific cause
router.get("/cause/:causeId", async (req, res) => {
  try {
    const { causeId } = req.params
    console.log("=== Fetching donations for cause ===")
    console.log("CauseId:", causeId)
    console.log("MongoDB connection state:", mongoose.connection.readyState)
    console.log("DonationModel type:", typeof DonationModel)

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected! Connection state:", mongoose.connection.readyState)
      return res.status(500).json({
        message: "Database connection error",
        details: "MongoDB is not connected. Please check your database connection.",
      })
    }

    // Check if DonationModel model is properly defined
    if (typeof DonationModel !== "function" || typeof DonationModel.find !== "function") {
      console.error("DonationModel model is not properly defined:", DonationModel)
      return res.status(500).json({
        message: "Server configuration error",
        details: "The DonationModel model is not properly defined.",
      })
    }

    // Get donations for this cause
    console.log("Executing database query for donations...")

    // Temporary fix: Return empty array if DonationModel.find is not a function
    let donations = []
    try {
      donations = await DonationModel.find({ cause: causeId }).sort({ createdAt: -1 })
    } catch (findError) {
      console.error("Error finding donations:", findError)
      return res.status(500).json({
        message: "Database query error",
        error: findError.message,
      })
    }

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
})

// Add a new route to check if we're getting mock data
router.get("/cause/:causeId/debug", async (req, res) => {
  const { causeId } = req.params
  console.log("=== DEBUG: Fetching donations for cause ===")
  console.log("CauseId:", causeId)
  console.log("MongoDB connection state:", mongoose.connection.readyState)

  // Check if there's any middleware intercepting this request
  res.json({
    message: "Debug route hit",
    causeId,
    mongodbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  })
})

export default router

