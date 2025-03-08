"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold text-gray-900">CharityHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/causes" className="text-gray-600 hover:text-primary transition-colors">
              Causes
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/user/dashboard" className="text-gray-600 hover:text-primary transition-colors">
              Dashboard
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/causes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Causes
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Contact
            </Link>
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavigationBar

