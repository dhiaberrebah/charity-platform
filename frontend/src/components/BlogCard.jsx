import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"

const BlogCard = ({ post, onClick, delay = 0 }) => {
  return (
    <motion.div
      className="bg-blue-900/30 rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-400/30 
                 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full capitalize">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4 text-sm text-blue-300">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-blue-200 line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full border border-blue-500/30"
          />
          <div className="text-sm">
            <p className="text-white font-medium">{post.author.name}</p>
            <p className="text-blue-300 text-xs truncate">{post.author.bio}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BlogCard
