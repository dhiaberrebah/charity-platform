"use client"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Index from "./pages/Index"
import Causes from "./pages/Causes"
import About from "./pages/About"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/Dashboard"
import ManageUsers from "./pages/admin/ManageUsers"
import ManageCauses from "./pages/admin/ManageCauses"
import ViewDonations from "./pages/admin/ViewDonations"
import UserDashboard from "./pages/user/Dashboard"
import UserHome from "./pages/user/Home"
import AdminHome from "./pages/admin/adminhome"

const queryClient = new QueryClient()

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // Try to get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"))

        if (userData) {
          setIsAuthenticated(true)
          setUserRole(userData.role || (userData.isAdmin ? "admin" : "user"))
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // For admin routes, check if user is admin
  if (allowedRoles && allowedRoles.includes("admin") && userRole !== "admin") {
    return <Navigate to="/user/home" replace />
  }

  // For user routes, no additional check needed as all authenticated users can access
  return children
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/causes" element={<Causes />} />
          <Route path="/causes/:id" element={<Causes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/causes"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageCauses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ViewDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/home"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminHome />
              </ProtectedRoute>
            }
          />

          {/* User routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/home"
            element={
              <ProtectedRoute>
                <UserHome />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App

