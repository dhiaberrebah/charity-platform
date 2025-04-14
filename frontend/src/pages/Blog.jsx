"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import NavigationBar from "../components/NavigationBar"
import UserNavigationBar from "../components/UserNavigationBar"
import AdminNavbar from "../components/AdminNavbar"
import BlogCard from "../components/BlogCard"
import { blogPosts } from "../data/blogPosts"

const Blog = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const { isAuthenticated, isAdmin, isAdminInUserMode } = useAuth()

  // Determine which navbar to show based on auth state
  let NavbarComponent = NavigationBar
  if (isAdmin) {
    NavbarComponent = AdminNavbar
  } else if (isAuthenticated || isAdminInUserMode) {
    NavbarComponent = UserNavigationBar
  }

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <NavbarComponent />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Our Blog</h1>
          <p className="text-xl text-blue-200">
            Stay updated with our latest news and insights
          </p>
        </motion.div>

        <div className="mb-12 space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg
                         text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <BlogCard
                post={post}
                onClick={() => navigate(`/blog/${post.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-blue-200 text-lg">No articles found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Blog
