"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, LogOut, Settings, ChevronDown, HandHeart, UserCheck } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import NotificationBell from "./NotificationBell"

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, switchToUserMode } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 1 }}
              >
                <HandHeart className="h-8 w-8 text-blue-300 mr-2" />
              </motion.div>
              <span className="font-bold text-xl text-blue-100">CharityHub Admin</span>
            </motion.div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/admin/users"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
                  >
                    Manage Users
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/admin/causes"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
                  >
                    Manage Causes
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/admin/donations"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
                  >
                    View Donations
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center cursor-pointer"
                  onClick={switchToUserMode}
                >
                  <UserCheck className="mr-1 h-4 w-4" />
                  User Mode
                </motion.div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Add the NotificationBell component here */}
              <NotificationBell />

              <div className="ml-3 relative">
                <div>
                  <motion.button
                    className="max-w-xs bg-blue-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                    id="user-menu"
                    aria-haspopup="true"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-200" />
                    </div>
                    <span className="ml-2 text-blue-100">Admin</span>
                    <ChevronDown
                      className={`ml-1 h-4 w-4 text-blue-300 transition-transform ${isProfileOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </motion.button>
                </div>
                {isProfileOpen && (
                  <motion.div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                      role="menuitem"
                    >
                      <User className="mr-2 h-4 w-4 text-blue-500" /> Your Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                      role="menuitem"
                    >
                      <Settings className="mr-2 h-4 w-4 text-blue-500" /> Settings
                    </Link>
                    <button
                      onClick={switchToUserMode}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                      role="menuitem"
                    >
                      <UserCheck className="mr-2 h-4 w-4 text-green-500" /> Switch to User Mode
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                      role="menuitem"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-blue-500" /> Sign out
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/admin/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-800 hover:bg-blue-700"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/causes"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              Manage Causes
            </Link>
            <Link
              to="/admin/donations"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              View Donations
            </Link>
            <button
              onClick={switchToUserMode}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-purple-600 text-white hover:bg-purple-700 flex items-center"
            >
              <UserCheck className="mr-2 h-5 w-5" /> Switch to User Mode
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default AdminNavbar

