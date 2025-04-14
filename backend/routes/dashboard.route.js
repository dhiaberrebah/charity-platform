import express from "express"
import User from "../models/user.model.js"
import Cause from "../models/cause.model.js"
import Donation from "../models/Donation.js"

const router = express.Router()

// Get all dashboard stats in one request
router.get("/stats", async (req, res) => {
  try {
    console.log("Fetching dashboard stats from database...")

    // Get current date and date 30 days ago
    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
    const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

    // Calculate monthly growth
    const currentPeriodUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })

    const previousPeriodUsers = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    })

    let monthlyGrowth = 0
    if (previousPeriodUsers > 0) {
      monthlyGrowth = ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100
    } else if (currentPeriodUsers > 0) {
      monthlyGrowth = 100
    }

    monthlyGrowth = Math.round(monthlyGrowth * 10) / 10

    // Get other stats as before...
    const totalUsers = await User.countDocuments()
    const totalCauses = await Cause.countDocuments()
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

    // Get verification stats
    const totalVerifications = await User.countDocuments({
      'documents.front': { $exists: true },
      'documents.back': { $exists: true }
    })

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
      monthlyGrowth,
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

// Add this new route for monthly growth
router.get("/monthly-growth", async (req, res) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(now.getDate() - 30)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(now.getDate() - 60)

    // Get donations for current and previous periods
    const currentPeriodDonations = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ])

    const previousPeriodDonations = await Donation.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: sixtyDaysAgo,
            $lt: thirtyDaysAgo
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ])

    const currentAmount = currentPeriodDonations[0]?.totalAmount || 0
    const previousAmount = previousPeriodDonations[0]?.totalAmount || 0

    let percentage = 0
    if (previousAmount > 0) {
      percentage = ((currentAmount - previousAmount) / previousAmount) * 100
    } else if (currentAmount > 0) {
      percentage = 100
    }

    percentage = Math.round(percentage * 10) / 10

    console.log({
      calculation: {
        currentAmount,
        previousAmount,
        formula: `((${currentAmount} - ${previousAmount}) / ${previousAmount}) * 100`,
        result: percentage
      }
    })

    res.json({ 
      percentage,
      debug: {
        currentPeriod: {
          amount: currentAmount,
          count: currentPeriodDonations[0]?.count || 0
        },
        previousPeriod: {
          amount: previousAmount,
          count: previousPeriodDonations[0]?.count || 0
        }
      }
    })
  } catch (error) {
    console.error("Error calculating donation growth:", error)
    res.status(500).json({ error: "Failed to calculate donation growth" })
  }
})

// Get top donors
router.get("/top-donors", async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      {
        $match: {
          status: "completed",
          amount: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: "$donor.email",
          totalAmount: { 
            $sum: "$amount"
          },
          donationsCount: { $sum: 1 },
          isAnonymous: { $first: "$isAnonymous" },
          firstName: { $first: "$donor.firstName" },
          lastName: { $first: "$donor.lastName" }
        }
      },
      {
        $project: {
          _id: 0,
          email: "$_id",
          totalAmount: { 
            $round: ["$totalAmount", 2]
          },
          donationsCount: 1,
          // Always show the actual name, regardless of anonymous status
          name: {
            $concat: [
              { $ifNull: ["$firstName", ""] },
              " ",
              { 
                $cond: {
                  if: { $gt: [{ $strLenCP: { $ifNull: ["$lastName", ""] } }, 0] },
                  then: { 
                    $concat: [
                      { $substr: ["$lastName", 0, 1] },
                      "."
                    ]
                  },
                  else: ""
                }
              }
            ]
          },
          // Keep isAnonymous flag for reference
          isAnonymous: "$isAnonymous"
        }
      },
      {
        $sort: { 
          totalAmount: -1,
          donationsCount: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    // Log the results for verification
    console.log("Top donors with names:", topDonors.map(d => ({
      name: d.name,
      count: d.donationsCount,
      total: d.totalAmount,
      isAnonymous: d.isAnonymous
    })));

    res.json(topDonors);
  } catch (error) {
    console.error("Error fetching top donors:", error);
    res.status(500).json({ 
      error: "Failed to fetch top donors",
      details: error.message 
    });
  }
});

// Add this new route for category statistics
router.get("/category-stats", async (req, res) => {
  try {
    // First get all donations grouped by cause category
    const donationStats = await Donation.aggregate([
      {
        $lookup: {
          from: "causes",
          localField: "causeId",
          foreignField: "_id",
          as: "cause"
        }
      },
      { $unwind: "$cause" },
      {
        $group: {
          _id: "$cause.category",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    // Then get active causes count by category
    const activeStats = await Cause.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$category",
          activeCausesCount: { $sum: 1 }
        }
      }
    ]);

    // Define all possible categories
    const categories = ['medical', 'education', 'emergency', 'community', 'environment'];

    // Create maps for easier lookup
    const donationsMap = donationStats.reduce((acc, item) => {
      acc[item._id.toLowerCase()] = item.totalAmount;
      return acc;
    }, {});

    const activeCausesMap = activeStats.reduce((acc, item) => {
      acc[item._id.toLowerCase()] = item.activeCausesCount;
      return acc;
    }, {});

    // Combine everything with default values
    const result = categories.map(category => ({
      category: category.toLowerCase(),
      totalAmount: donationsMap[category.toLowerCase()] || 0,
      activeCausesCount: activeCausesMap[category.toLowerCase()] || 0
    }));

    // Add some sample data for testing (remove in production)
    result[0].totalAmount = 1000; // Medical
    result[0].activeCausesCount = 2;
    result[1].totalAmount = 750;  // Education
    result[1].activeCausesCount = 1;
    result[2].totalAmount = 1500; // Emergency
    result[2].activeCausesCount = 3;

    console.log("Sending category stats:", result);
    res.json(result);

  } catch (error) {
    console.error("Error fetching category statistics:", error);
    res.status(500).json({ 
      error: "Failed to fetch category statistics",
      details: error.message 
    });
  }
});

export default router

