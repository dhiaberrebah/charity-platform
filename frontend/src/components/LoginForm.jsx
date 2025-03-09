"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { motion } from "framer-motion"
import axios from "axios"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", formData, {
        withCredentials: true, // Important for cookies to be sent
      })

      // Store user data in localStorage for persistence
      localStorage.setItem("userData", JSON.stringify(response.data))

      // Check user role and redirect accordingly
      if (response.data.isAdmin || response.data.role === "admin") {
        navigate("/admin/home")
      } else {
        navigate("/user/home")
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message)
      setError(error.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 mt-6">
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleLogin}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-blue-100">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white/10 border-blue-600/30 text-white pl-10 placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-blue-100">
                Password
              </Label>
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white/10 border-blue-600/30 text-white pl-10 placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-2">
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </motion.div>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full bg-blue-700/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-blue-800/50 backdrop-blur-sm px-4 text-blue-200 font-medium rounded-full">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="bg-white/5 border-blue-500/30 text-blue-100 hover:bg-blue-800/50 hover:text-white"
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4383 21.879V14.89H7.89831V12H10.4383V9.797C10.4383 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1923C13.9503 8.562 13.5623 9.333 13.5623 10.124V12H16.3363L15.8933 14.89H13.5623V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
          </svg>
          Facebook
        </Button>
        <Button
          variant="outline"
          className="bg-white/5 border-blue-500/30 text-blue-100 hover:bg-blue-800/50 hover:text-white"
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4383 21.879V14.89H7.89831V12H10.4383V9.797C10.4383 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1923C13.9503 8.562 13.5623 9.333 13.5623 10.124V12H16.3363L15.8933 14.89H13.5623V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
          </svg>
          Google
        </Button>
      </div>
    </div>
  )
}

export default LoginForm

