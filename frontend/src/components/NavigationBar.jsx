"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { HandHeart, Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { motion } from "framer-motion"

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white z-50 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 1 }}
              >
                <HandHeart className="w-6 h-6 text-blue-300" />
              </motion.div>
              <span className="text-xl font-semibold text-blue-100">CharityHub</span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Link to="/" className="text-blue-100 hover:text-white transition-colors">
                Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Link to="/causes" className="text-blue-100 hover:text-white transition-colors">
                Causes
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Link to="/about" className="text-blue-100 hover:text-white transition-colors">
                About
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Link to="/contact" className="text-blue-100 hover:text-white transition-colors">
                Contact
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login">
                <Button variant="ghost" className="text-blue-100 hover:text-white hover:bg-blue-800">
                  Login
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Sign Up</Button>
              </Link>
            </motion.div>
          </div>

          <div className="md:hidden">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" onClick={toggleMenu} className="text-blue-100 hover:text-white hover:bg-blue-800">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-blue-900/95 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800"
            >
              Home
            </Link>
            <Link
              to="/causes"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800"
            >
              Causes
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default NavigationBar

