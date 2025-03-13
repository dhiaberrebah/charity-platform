import mongoose from "mongoose"
import Donation from "../models/Donation.js"

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    // Log the entire request for debugging
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

    // Create donation object
    console.log("Creating donation document...")
    const donation = new Donation({
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

// Test function to verify controller is working
export const testDonationController = (req, res) => {
  console.log("Donation controller test function called")
  return res.json({
    message: "Donation controller is working!",
    timestamp: new Date().toISOString(),
  })
}

