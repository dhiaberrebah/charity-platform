import User from "../models/user.model.js"
import Donation from "../models/Donation.js"

export async function GET() {
  try {
    // Get current date and date 30 days ago
    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
    const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

    // Get counts for current and previous 30-day periods
    const currentPeriodUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })

    const previousPeriodUsers = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    })

    // Calculate growth percentage
    let growthPercentage = 0
    if (previousPeriodUsers > 0) {
      growthPercentage = ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100
    } else if (currentPeriodUsers > 0) {
      growthPercentage = 100 // If there were no users in previous period, growth is 100%
    }

    // Round to 1 decimal place
    growthPercentage = Math.round(growthPercentage * 10) / 10

    return Response.json({ percentage: growthPercentage })
  } catch (error) {
    console.error("Error calculating monthly growth:", error)
    return Response.json({ error: "Failed to calculate monthly growth" }, { status: 500 })
  }
}
