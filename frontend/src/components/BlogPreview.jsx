"use client"

import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const blogPosts = [
  {
    id: 1,
    title: "The Impact of Clean Water on Communities",
    excerpt: "Discover how access to clean water transforms lives and communities around the world.",
    image: "https://source.unsplash.com/random/800x600/?water",
    date: "May 15, 2025",
  },
  {
    id: 2,
    title: "Education: A Path to Empowerment",
    excerpt: "Learn about the lasting effects of education on individuals and society as a whole.",
    image: "https://source.unsplash.com/random/800x600/?education",
    date: "May 10, 2025",
  },
  {
    id: 3,
    title: "Protecting Biodiversity: Why It Matters",
    excerpt: "Explore the importance of preserving Earth's diverse ecosystems and species.",
    image: "https://source.unsplash.com/random/800x600/?nature",
    date: "May 5, 2025",
  },
]

const BlogPreview = () => {
  return (
    <section className="py-16 bg-blue-900/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Latest from Our Blog</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Stay informed about our causes and the impact of your donations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
            >
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <p className="text-sm text-blue-300 mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                <p className="text-blue-100 mb-4">{post.excerpt}</p>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center text-blue-300 hover:text-blue-200">
                    Read more <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
              View All Posts
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogPreview

