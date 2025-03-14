"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Heart, Target, Calendar, AlertCircle, Check, Search, Filter, RefreshCw } from "lucide-react"
import UserNavigationBar from "../../components/UserNavigationBar"
import { useAuth } from "../../context/AuthContext"

// Define the API base URL
const API_BASE_URL = "http://localhost:5001"

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all") // all, unread, cause, donation
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      console.log("Fetching user notifications...")
      const response = await fetch(`${API_BASE_URL}/api/notifications/user?limit=50`, {
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
      setError(null)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications. " + error.message)
      setNotifications([])
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
        throw new Error("Failed to mark notification as read")
      }

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      alert("Error: " + error.message)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
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
        throw new Error("Failed to mark all notifications as read")
      }

      // Update local state
      setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
      alert("Error: " + error.message)
    }
  }

  // Format notification time
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

  // Get notification icon and color based on type
  const getNotificationDetails = (type) => {
    switch (type) {
      case "user":
        return {
          icon: User,
          bgColor: "bg-blue-500/20",
          iconColor: "text-blue-400",
          gradient: "from-blue-500/20 to-blue-600/20",
          label: "Account",
        }
      case "cause":
        return {
          icon: Target,
          bgColor: "bg-purple-500/20",
          iconColor: "text-purple-400",
          gradient: "from-purple-500/20 to-purple-600/20",
          label: "Cause",
        }
      case "donation":
        return {
          icon: Heart,
          bgColor: "bg-green-500/20",
          iconColor: "text-green-400",
          gradient: "from-green-500/20 to-green-600/20",
          label: "Donation",
        }
      default:
        return {
          icon: AlertCircle,
          bgColor: "bg-gray-500/20",
          iconColor: "text-gray-400",
          gradient: "from-gray-500/20 to-gray-600/20",
          label: "Notification",
        }
    }
  }

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    // Apply type filter
    if (filter === "unread" && notification.isRead) return false
    if (filter !== "all" && filter !== "unread" && notification.type !== filter) return false

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return notification.message.toLowerCase().includes(query)
    }

    return true
  })

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <UserNavigationBar />

      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-blue-500/20 mb-8">
          <div className="p-6 border-b border-blue-500/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Your Notifications</h1>
                <p className="text-blue-200">Stay updated on your causes and donations</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Mark all as read
                </button>
                <button
                  onClick={() => fetchNotifications()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 rounded-md text-sm transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-blue-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-300" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-blue-900/30 border border-blue-500/30 rounded-md text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All notifications</option>
                  <option value="unread">Unread only</option>
                  <option value="cause">Causes</option>
                  <option value="donation">Donations</option>
                </select>
              </div>
            </div>
          </div>

          {loading && notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mx-auto mb-4"></div>
              <p className="text-blue-200">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-blue-100 mb-4">{error}</p>
              <button
                onClick={() => fetchNotifications()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-100">
                {searchQuery
                  ? "No notifications match your search"
                  : filter !== "all"
                    ? `No ${filter} notifications found`
                    : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-blue-500/20">
              {filteredNotifications.map((notification) => {
                const { icon: Icon, bgColor, iconColor, gradient, label } = getNotificationDetails(notification.type)
                const time = formatTime(notification.createdAt)

                return (
                  <motion.div
                    key={notification._id}
                    className={`p-5 hover:bg-blue-900/30 transition-colors ${
                      !notification.isRead ? "bg-blue-900/20" : ""
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${bgColor} rounded-full p-3 mr-4`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`inline-block text-xs font-medium ${bgColor} text-opacity-90 px-2 py-0.5 rounded`}
                              >
                                {label}
                              </span>
                              {!notification.isRead && (
                                <span className="inline-block text-xs font-medium bg-blue-600 text-white px-2 py-0.5 rounded">
                                  New
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm ${!notification.isRead ? "font-semibold text-white" : "text-blue-100"}`}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 text-xs text-blue-300">
                              <Calendar className="h-3 w-3 mr-1" />
                              {time.relative}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 rounded text-xs transition-colors"
                              >
                                <Check className="h-3 w-3" />
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage

