import express from "express"
import mongoose from "mongoose"
import Donation from "../models/Donation.js"

const router = express.Router()

// Simple test route to verify the router is working
router.get("/test", (req, res) => {
  console.log("Donations test route hit")
  res.json({ message: "Donations API is working!" })
})

// Create a new donation
router.post("/", async (req, res) => {
  try {
    // Log the entire request for debugging
    console.log("=== Donation POST request received ===")
    console.log("Body:", JSON.stringify(req.body, null, 2))

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

    // Log successful validation
    console.log("Donation data validated successfully")
    console.log("Processing donation for cause:", causeId)
    console.log("Donation amount:", amount)

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected! Connection state:", mongoose.connection.readyState)
      return res.status(500).json({
        message: "Database connection error",
        details: "MongoDB is not connected. Please check your database connection.",
      })
    }

    // Create donation record
    try {
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
      })

      console.log("Donation object created:", JSON.stringify(donation, null, 2))

      // Save donation to database with explicit error handling
      console.log("Attempting to save donation to database...")
      let savedDonation
      try {
        savedDonation = await donation.save()
        console.log("✅ Donation saved successfully to database!")
        console.log("Donation ID:", savedDonation._id)
      } catch (saveError) {
        console.error("❌ Error saving donation:", saveError)

        // Check for validation errors
        if (saveError.name === "ValidationError") {
          console.error("Validation error details:", saveError.errors)
          return res.status(400).json({
            message: "Validation error",
            errors: saveError.errors,
          })
        }

        // Check for duplicate key errors
        if (saveError.code === 11000) {
          console.error("Duplicate key error:", saveError.keyValue)
          return res.status(400).json({
            message: "Duplicate key error",
            duplicateKey: saveError.keyValue,
          })
        }

        throw saveError // Re-throw for the outer catch block
      }

      // Return success response
      res.status(201).json({
        message: "Donation successful",
        donation: {
          id: savedDonation._id,
          amount: savedDonation.amount,
          date: savedDonation.createdAt,
        },
      })
    } catch (modelError) {
      console.error("Error creating or saving donation model:", modelError)
      res.status(500).json({
        message: "Error creating or saving donation",
        error: modelError.message,
        stack: modelError.stack,
      })
    }
  } catch (error) {
    console.error("Error processing donation:", error)
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    })
  }
})

// Get donations for a specific cause
router.get("/cause/:causeId", async (req, res) => {
  try {
    const { causeId } = req.params
    console.log("=== Fetching donations for cause ===")
    console.log("CauseId:", causeId)

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected! Connection state:", mongoose.connection.readyState)
      // Return mock data as fallback
      return res.json([
        {
          _id: new mongoose.Types.ObjectId().toString(),
          amount: 50,
          isAnonymous: false,
          donor: {
            firstName: "John",
            lastName: "D.",
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        },
        {
          _id: new mongoose.Types.ObjectId().toString(),
          amount: 100,
          isAnonymous: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
      ])
    }

    // Get donations for this cause
    console.log("Executing database query for donations...")

    try {
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
      res.json(formattedDonations)
    } catch (dbError) {
      console.error("Database error when fetching donations:", dbError)
      // Return mock data as fallback
      return res.json([
        {
          _id: new mongoose.Types.ObjectId().toString(),
          amount: 50,
          isAnonymous: false,
          donor: {
            firstName: "John",
            lastName: "D.",
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        },
        {
          _id: new mongoose.Types.ObjectId().toString(),
          amount: 100,
          isAnonymous: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
      ])
    }
  } catch (error) {
    console.error("Error fetching cause donations:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

