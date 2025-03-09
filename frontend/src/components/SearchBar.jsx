"use client"

import { Search } from "lucide-react"
import { motion } from "framer-motion"

const SearchBar = () => {
  return (
    <motion.div
      className="relative max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="text"
        placeholder="Search causes..."
        className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder:text-blue-200/70"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
    </motion.div>
  )
}

export default SearchBar

