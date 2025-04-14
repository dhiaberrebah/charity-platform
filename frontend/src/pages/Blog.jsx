import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import BlogCard from "../components/BlogCard"
import { blogPosts } from "../data/blogPosts"

const Blog = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", ...new Set(blogPosts.map(post => post.category))]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Our Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover stories of impact, innovation, and inspiration from our global community.
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

            <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/50'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-blue-200">
            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/blog/${post.id}`)}
              delay={index * 0.1}
            />
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
