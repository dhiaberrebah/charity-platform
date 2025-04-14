"use client"

import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import BlogCard from "./BlogCard"
import { blogPosts } from "../data/blogPosts"

const BlogPreview = () => {
  const navigate = useNavigate()
  const previewPosts = blogPosts.slice(0, 3)

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-purple-900/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Latest from Our Blog</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Stay informed about our causes and the impact of your donations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/blog/${post.id}`)}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent 
                     text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700
                     transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View All Posts
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogPreview

