"use client"

import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { blogPosts } from "../data/blogPosts"

const BlogPost = () => {
  const { id } = useParams()
  const post = blogPosts.find(post => post.id === parseInt(id))

  if (!post) {
    return <div>Post not found</div>
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="flex items-center gap-2 text-blue-100">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <Button variant="outline" onClick={handleShare} className="text-blue-100">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category Tag */}
          <div className="mb-6">
            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full capitalize">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

          {/* Excerpt/Description */}
          <p className="text-xl text-blue-200 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center gap-6 mb-8 text-blue-300 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-12 p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full border-2 border-blue-500/30"
            />
            <div>
              <p className="font-medium text-white">{post.author.name}</p>
              <p className="text-sm text-blue-300">{post.author.bio}</p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Content */}
          <div
            className="prose prose-lg prose-invert max-w-none prose-headings:text-blue-100 
                     prose-p:text-blue-200 prose-li:text-blue-200 prose-strong:text-white
                     prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-hr:border-blue-500/20
                     prose-blockquote:border-blue-500 prose-blockquote:text-blue-300
                     prose-code:text-blue-300 prose-pre:bg-blue-900/30"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default BlogPost
