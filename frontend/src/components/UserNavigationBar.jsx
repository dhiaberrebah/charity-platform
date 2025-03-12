"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, Bell, LogOut, Settings, ChevronDown, HandHeart, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"

const UserNavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, isAdminInUserMode, switchToAdminMode } = useAuth()

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
                <HandHeart className="mr-3 h-8 w-8 text-blue-300" />
              </motion.div>
              <span className="text-blue-100">CharityHub</span>
            </motion.div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/user/home"
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 transition-colors"
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/causes"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
                  >
                    Explore
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/user/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
                  >
                    My Dashboard
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/about"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    to="/contact"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </motion.div>
                {isAdminInUserMode && (
                  <motion.div
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center cursor-pointer"
                    onClick={switchToAdminMode}
                  >
                    <Shield className="mr-1 h-4 w-4" />
                    Admin Mode
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <motion.button
                className="p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </motion.button>

              <div className="relative ml-3">
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
                    <span className="ml-2 text-blue-100">
                      {user?.prenom} {user?.nom}
                    </span>
                    <ChevronDown
                      className={`ml-1 h-4 w-4 text-blue-300 transition-transform ${isProfileOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </motion.button>
                </div>
                {isProfileOpen && (
                  <motion.div
                    className="absolute right-0 z-50 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/user/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                      role="menuitem"
                    >
                      <User className="mr-2 h-4 w-4 text-blue-500" /> Your Profile
                    </Link>
                    <Link
                      to="/user/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                      role="menuitem"
                    >
                      <Settings className="mr-2 h-4 w-4 text-blue-500" /> Settings
                    </Link>
                    {isAdminInUserMode && (
                      <button
                        onClick={switchToAdminMode}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                        role="menuitem"
                      >
                        <Shield className="mr-2 h-4 w-4 text-purple-500" /> Switch to Admin Mode
                      </button>
                    )}
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
              to="/user/home"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-800 hover:bg-blue-700"
            >
              Home
            </Link>
            <Link
              to="/causes"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              Explore
            </Link>
            <Link
              to="/user/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              My Dashboard
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              Contact
            </Link>
            {isAdminInUserMode && (
              <button
                onClick={switchToAdminMode}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-purple-600 text-white hover:bg-purple-700 flex items-center"
              >
                <Shield className="mr-2 h-5 w-5" /> Switch to Admin Mode
              </button>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-200" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  {user?.prenom} {user?.nom}
                </div>
                <div className="text-sm font-medium leading-none text-blue-200 mt-1">{user?.email}</div>
              </div>
              <button className="ml-auto bg-blue-800 flex-shrink-0 p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/user/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
              >
                Your Profile
              </Link>
              <Link
                to="/user/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
              >
                Settings
              </Link>
              {isAdminInUserMode && (
                <button
                  onClick={switchToAdminMode}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
                >
                  Switch to Admin Mode
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default UserNavigationBar

