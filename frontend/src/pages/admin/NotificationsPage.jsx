"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AdminNavbar from "../../components/AdminNavbar"

// Define the API base URL
const API_BASE_URL = "http://localhost:5001" // Update this to match your backend URL

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    skip: 0,
    hasMore: false,
  })

  // Fetch notifications
  const fetchNotifications = async (skip = 0) => {
    setLoading(true)
    try {
      console.log("Fetching notifications...")
      const response = await fetch(`${API_BASE_URL}/api/notifications?limit=${pagination.limit}&skip=${skip}`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      console.log("Response status:", response.status)

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const text = await response.text()
        console.error("Error response:", text)
        throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}...`)
      }

      const data = await response.json()
      console.log("Notifications data:", data)

      if (skip === 0) {
        setNotifications(data.notifications || [])
      } else {
        setNotifications((prev) => [...prev, ...(data.notifications || [])])
      }

      setPagination(
        data.pagination || {
          total: 0,
          limit: pagination.limit,
          skip: skip,
          hasMore: false,
        },
      )

      setError(null)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications. " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load more notifications
  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchNotifications(pagination.skip + pagination.limit)
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

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const text = await response.text()
        console.error("Error deleting notification:", text)
        throw new Error("Failed to delete notification")
      }

      // Update local state
      setNotifications(notifications.filter((notification) => notification._id !== id))
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }))
    } catch (error) {
      console.error("Error deleting notification:", error)
      alert("Error: " + error.message)
    }
  }

  // Format notification time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "user":
        return "👤"
      case "cause":
        return "🎯"
      case "donation":
        return "💰"
      default:
        return "📣"
    }
  }

  // Get notification color
  const getNotificationColor = (type) => {
    switch (type) {
      case "user":
        return "bg-blue-100 text-blue-800"
      case "cause":
        return "bg-green-100 text-green-800"
      case "donation":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h1 className="text-lg font-medium text-gray-900">Notifications</h1>

              <div className="flex space-x-3">
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Mark all as read
                </button>
              </div>
            </div>

            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>Error: {error}</p>
                <button
                  onClick={() => fetchNotifications()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50" : ""}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 rounded-full p-2 ${getNotificationColor(notification.type)}`}>
                        <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <p className={`text-sm ${!notification.isRead ? "font-semibold" : "text-gray-700"}`}>
                            {notification.message}
                          </p>
                          <div className="flex space-x-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {pagination.hasMore && (
                  <div className="p-4 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage

