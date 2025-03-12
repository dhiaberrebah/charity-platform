"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Protected route for any authenticated user
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

// Update the AdminRoute function to check for isAdminInUserMode
export function AdminRoute() {
  const { isAdmin, loading, isAdminInUserMode } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Allow access if they're an admin OR if they're an admin in user mode
  // This prevents the unauthorized redirect when switching modes
  return isAdmin || isAdminInUserMode ? <Outlet /> : <Navigate to="/unauthorized" replace />
}

// Route that's only accessible to non-authenticated users
export function PublicOnlyRoute() {
  const { isAuthenticated, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />
  }

  return <Outlet />
}

