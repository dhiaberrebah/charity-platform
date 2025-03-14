"use client"

import { useState, useEffect } from "react"
import { Bell, Check, User, Target, Heart, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"

// Define the API base URL
const API_BASE_URL = "http://localhost:5001"

const UserNotificationBell = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // Fetch notifications
  const fetchNotifications = async () => {
    if (loading) return

    setLoading(true)
    try {
      console.log("Fetching user notifications...")
      const response = await fetch(`${API_BASE_URL}/api/notifications/user?limit=10`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const text = await response.text()
        console.error("Error response:", text)
        throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}...`)
      }

      const data = await response.json()
      console.log("User notifications:", data.notifications)

      // No need to filter notifications as the backend already did that
      setNotifications(data.notifications || [])

      // Count unread notifications
      const unreadCount = (data.notifications || []).filter((n) => !n.isRead).length
      setUnreadCount(unreadCount)

      setError(null)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications")
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const text = await response.text()
        console.error("Error marking as read:", text)
        return
      }

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification,
        ),
      )

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      // We'll mark all notifications as read on the server
      // but only update the ones in our filtered list in the UI
      const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const text = await response.text()
        console.error("Error marking all as read:", text)
        return
      }

      // Update local state
      setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  // Periodically check for new notifications
  useEffect(() => {
    fetchNotifications() // Initial fetch

    // Set up polling for new notifications (every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Get notification icon and color based on type
  const getNotificationDetails = (type) => {
    switch (type) {
      case "user":
        return {
          icon: User,
          bgColor: "bg-blue-500/20",
          iconColor: "text-blue-400",
          gradient: "from-blue-500/20 to-blue-600/20",
        }
      case "cause":
        return {
          icon: Target,
          bgColor: "bg-purple-500/20",
          iconColor: "text-purple-400",
          gradient: "from-purple-500/20 to-purple-600/20",
        }
      case "donation":
        return {
          icon: Heart,
          bgColor: "bg-green-500/20",
          iconColor: "text-green-400",
          gradient: "from-green-500/20 to-green-600/20",
        }
      default:
        return {
          icon: Bell,
          bgColor: "bg-gray-500/20",
          iconColor: "text-gray-400",
          gradient: "from-gray-500/20 to-gray-600/20",
        }
    }
  }

  // Format relative time without date-fns
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      let relative = ""
      if (diffMins < 1) relative = "just now"
      else if (diffMins < 60) relative = `${diffMins}m ago`
      else if (diffHours < 24) relative = `${diffHours}h ago`
      else if (diffDays < 7) relative = `${diffDays}d ago`
      else relative = date.toLocaleDateString()

      // Format full date
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
      const full = date.toLocaleString(undefined, options)

      return { relative, full }
    } catch {
      return {
        relative: "recently",
        full: "unknown time",
      }
    }
  }

  return (
    <div className="relative">
      <motion.button
        className="relative p-2 text-blue-200 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="h-6 w-6" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 max-h-[32rem] bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 rounded-xl shadow-xl overflow-hidden z-50 border border-white/10"
            >
              {/* Header */}
              <div className="p-4 flex justify-between items-center border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Your Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" />
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(32rem-8rem)]">
                {loading && notifications.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center">
                    <p className="text-red-300 mb-2">{error}</p>
                    <button onClick={fetchNotifications} className="text-sm text-blue-300 hover:text-blue-200">
                      Try again
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-blue-200">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {notifications.map((notification) => {
                      const { icon: Icon, bgColor, iconColor, gradient } = getNotificationDetails(notification.type)
                      const time = formatTime(notification.createdAt)

                      return (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`relative p-4 transition-colors cursor-pointer
                            ${!notification.isRead ? "bg-gradient-to-r " + gradient : "hover:bg-white/5"}`}
                          onClick={() => !notification.isRead && markAsRead(notification._id)}
                        >
                          <div className="flex gap-4">
                            <div className={`flex-shrink-0 rounded-full p-2 ${bgColor}`}>
                              <Icon className={`h-5 w-5 ${iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white leading-5">{notification.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <time className="text-xs text-gray-300" title={time.full}>
                                  {time.relative}
                                </time>
                                {!notification.isRead && (
                                  <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                                    New
                                  </span>
                                )}
                              </div>
                              {notification.details?.causeId && (
                                <a
                                  href={`/causes/${notification.details.causeId}`}
                                  className="mt-2 inline-flex items-center text-sm text-blue-300 hover:text-blue-200"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View cause
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                <a
                  href="/user/notifications"
                  className="block text-center text-sm text-blue-300 hover:text-blue-200 transition-colors"
                >
                  View all notifications
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserNotificationBell

