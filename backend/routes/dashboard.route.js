import express from "express"
import User from "../models/user.model.js"
import Cause from "../models/cause.model.js"

const router = express.Router()

// Get all dashboard stats in one request
router.get("/stats", async (req, res) => {
  try {
    console.log("Fetching user and cause counts from database...")

    // Get total users - real database query
    const totalUsers = await User.countDocuments()
    console.log("Total users from database:", totalUsers)

    // Get total causes (without any filter) - real database query
    const totalCauses = await Cause.countDocuments()
    console.log("Total causes from database:", totalCauses)

    // Debug: Log a sample cause to see its structure
    const sampleCause = await Cause.findOne()
    console.log("Sample cause from database:", sampleCause)

    // For now, use placeholder values for donations and growth
    const totalDonations = 0
    const monthlyGrowth = 0

    res.json({
      totalUsers,
      totalDonations,
      activeCauses: totalCauses, // Use total causes instead of active causes for now
      monthlyGrowth,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    res.status(500).json({
      error: "Failed to fetch dashboard stats",
      message: error.message,
    })
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
    // Get total causes without filtering by status
    const count = await Cause.countDocuments()
    console.log("Total causes count API called, result:", count)
    res.json({ count })
  } catch (error) {
    console.error("Error fetching causes count:", error)
    res.status(500).json({ error: "Failed to fetch causes count" })
  }
})

export default router

