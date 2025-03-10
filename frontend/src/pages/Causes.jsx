"use client"

import { motion } from "framer-motion"
import NavigationBar from "../components/NavigationBar"
import CausesSection from "../components/CausesSection"

const Causes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      
      <div className="pt-16">
        {/* Hero Section */}
        <motion.div 
          className="bg-gradient-to-b from-blue-800/50 to-indigo-900/50 backdrop-blur-sm py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white mb-4">Our Causes</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Discover the various initiatives we're supporting and join us in making a difference.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Causes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CausesSection />
        </motion.div>
      </div>
    </div>
  )
}

export default Causes
