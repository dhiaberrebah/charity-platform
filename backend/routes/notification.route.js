import express from "express"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  getUserNotifications, // Import the new controller function
} from "../controllers/notification.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// All notification routes require admin privileges
router.get("/", protectRoute, adminRoute, getNotifications)
router.get("/unread-count", protectRoute, adminRoute, getUnreadCount)
router.put("/:id/read", protectRoute, markAsRead)
router.put("/read-all", protectRoute, markAllAsRead)
router.delete("/:id", protectRoute, adminRoute, deleteNotification)

// Add a new route for user notifications
router.get("/user", protectRoute, getUserNotifications)

export default router

