import express from "express"
import User from "../models/user.model.js"
import Cause from "../models/cause.model.js"
import Donation from "../models/Donation.js"

const router = express.Router()

// Get all dashboard stats in one request
router.get("/stats", async (req, res) => {
  try {
    console.log("Fetching dashboard stats from database...")

    // Get total users
    const totalUsers = await User.countDocuments()

    // Get total causes
    const totalCauses = await Cause.countDocuments()

    // Get total donations amount (sum of all donations)
    const donationsAggregation = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 }
        }
      }
    ])

    const totalDonationsAmount = donationsAggregation[0]?.totalAmount || 0
    const totalDonationsCount = donationsAggregation[0]?.totalCount || 0

    // Get total verifications
    const totalVerifications = await User.countDocuments({
      'documents.front': { $exists: true },
      'documents.back': { $exists: true }
    })

    // Get pending verifications count
    const pendingVerifications = await User.countDocuments({
      'documents.front': { $exists: true },
      'documents.back': { $exists: true },
      verificationStatus: 'pending'
    })

    res.json({
      totalUsers,
      totalDonationsAmount,
      totalDonationsCount,
      activeCauses: totalCauses,
      monthlyGrowth: 0,
      totalVerifications,
      pendingVerifications
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    res.status(500).json({
      error: "Failed to fetch dashboard stats",
      message: error.message,
    })
  }
})

// Get pending verifications count
router.get("/verifications/pending/count", async (req, res) => {
  try {
    const count = await User.countDocuments({ verificationStatus: 'pending' })
    res.json({ count })
  } catch (error) {
    console.error("Error fetching pending verifications count:", error)
    res.status(500).json({ error: "Failed to fetch verification count" })
  }
})

// Get total donations count
router.get("/donations/count", async (req, res) => {
  try {
    const count = await Donation.countDocuments()
    res.json({ count })
  } catch (error) {
    console.error("Error fetching donations count:", error)
    res.status(500).json({ error: "Failed to fetch donations count" })
  }
})

// Individual endpoints for specific stats
router.get("/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments()
    console.log("User count API called, result:", count)
    res.json({ count })
  } catch (error) {
    console.error("Error fetching user count:", error)
    res.status(500).json({ error: "Failed to fetch user count" })
  }
})

router.get("/causes/active/count", async (req, res) => {
  try {
    const count = await Cause.countDocuments()
    console.log("Total causes count API called, result:", count)
    res.json({ count })
  } catch (error) {
    console.error("Error fetching causes count:", error)
    res.status(500).json({ error: "Failed to fetch causes count" })
  }
})

export default router

