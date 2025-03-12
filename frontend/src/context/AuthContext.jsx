"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adminInUserMode, setAdminInUserMode] = useState(false)
  const navigate = useNavigate()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/auth/check", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      setUser(data)
      setAdminInUserMode(false) // Reset admin mode on login
      return { success: true, user: data }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      setAdminInUserMode(false) // Reset admin mode on logout
      navigate("/")
      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)
      return { success: false, error: error.message }
    }
  }

  // Function to switch to user mode (for admins)
  const switchToUserMode = () => {
    if (user?.isAdmin) {
      setAdminInUserMode(true)
      navigate("/user/home") // Redirect to user home page
    }
  }

  // Function to switch back to admin mode
  const switchToAdminMode = () => {
    if (user?.isAdmin) {
      setAdminInUserMode(false)
      navigate("/admin/dashboard") // Redirect to admin dashboard
    }
  }

  const isAdmin = user?.isAdmin === true && !adminInUserMode
  const isAuthenticated = !!user
  const isAdminInUserMode = user?.isAdmin === true && adminInUserMode

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isAdminInUserMode,
        login,
        logout,
        loading,
        switchToUserMode,
        switchToAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

