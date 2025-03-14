// Use URL encoding for the path to handle spaces
import path from "path"
import { fileURLToPath } from "url"
import mongoose from "mongoose"

// Get the directory name properly
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the schema directly in this file as a temporary fix
const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["user", "cause", "donation"],
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create the model directly here to avoid path issues
let Notification
try {
  // Try to get the model if it's already registered
  Notification = mongoose.model("Notification")
} catch (error) {
  // If not registered, create it
  Notification = mongoose.model("Notification", notificationSchema)
}

// Create a new notification
export const createNotification = async (type, message, details = {}) => {
  try {
    console.log(`Creating ${type} notification: "${message}"`, details)

    // Validate notification type
    if (!["user", "cause", "donation"].includes(type)) {
      console.error(`❌ Invalid notification type: ${type}`)
      return null
    }

    const notification = new Notification({
      type,
      message,
      details,
    })

    const savedNotification = await notification.save()
    console.log(`✅ ${type} notification created with ID: ${savedNotification._id}`)
    return savedNotification
  } catch (error) {
    console.error("❌ Error creating notification:", error)
    return null
  }
}

// Get all notifications (admin only)
export const getNotifications = async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 50
    const skip = Number.parseInt(req.query.skip) || 0
    const unreadOnly = req.query.unread === "true"

    const query = {}
    if (unreadOnly) {
      query.isRead = false
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Notification.countDocuments(query)

    res.status(200).json({
      notifications,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + notifications.length < total,
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    // Find the notification first
    const notification = await Notification.findById(id)

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    // If user is not an admin, check if they have permission to mark this notification as read
    if (!req.user.isAdmin && req.user.role !== "admin") {
      // For non-admin users, they can only mark donation notifications for their own causes as read
      if (notification.type === "donation") {
        // Get the user's causes
        const userCauses = await mongoose.model("Cause").find({ createdBy: userId })
        const userCauseIds = userCauses.map((cause) => cause._id.toString())

        // Check if the notification is for one of the user's causes
        const notificationCauseId = notification.details?.causeId?.toString()

        if (!notificationCauseId || !userCauseIds.includes(notificationCauseId)) {
          return res.status(403).json({ message: "Not authorized to mark this notification as read" })
        }
      } else {
        // Non-donation notifications can only be marked as read by admins
        return res.status(403).json({ message: "Not authorized to mark this notification as read" })
      }
    }

    // Update the notification
    notification.isRead = true
    await notification.save()

    res.status(200).json(notification)
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id

    // If user is admin, mark all notifications as read
    if (req.user.isAdmin || req.user.role === "admin") {
      await Notification.updateMany({ isRead: false }, { isRead: true })
    } else {
      // For non-admin users, only mark donation notifications for their causes as read
      const userCauses = await mongoose.model("Cause").find({ createdBy: userId })
      const userCauseIds = userCauses.map((cause) => cause._id)

      await Notification.updateMany(
        {
          type: "donation",
          "details.causeId": { $in: userCauseIds },
          isRead: false,
        },
        { isRead: true },
      )
    }

    res.status(200).json({ message: "Notifications marked as read" })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false })
    res.status(200).json({ count })
  } catch (error) {
    console.error("Error getting unread count:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params

    const notification = await Notification.findByIdAndDelete(id)

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.status(200).json({ message: "Notification deleted successfully" })
  } catch (error) {
    console.error("Error deleting notification:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Add a new function to get notifications for a specific user's causes
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    const limit = Number.parseInt(req.query.limit) || 50
    const skip = Number.parseInt(req.query.skip) || 0
    const unreadOnly = req.query.unread === "true"

    console.log(`Fetching notifications for user: ${userId}`)

    // First, get all the user's causes
    const userCauses = await mongoose.model("Cause").find({ createdBy: userId })
    const userCauseIds = userCauses.map((cause) => cause._id)

    console.log(`Found ${userCauseIds.length} causes for user`)

    // Build the query to find only donation notifications related to this user's causes
    const query = {
      // Only include donation notifications
      type: "donation",
      // Only for this user's causes
      "details.causeId": { $in: userCauseIds },
    }

    // Add unread filter if requested
    if (unreadOnly) {
      query.isRead = false
    }

    console.log("Notification query:", JSON.stringify(query))

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Notification.countDocuments(query)

    console.log(`Found ${notifications.length} notifications for user`)

    res.status(200).json({
      notifications,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + notifications.length < total,
      },
    })
  } catch (error) {
    console.error("Error fetching user notifications:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

