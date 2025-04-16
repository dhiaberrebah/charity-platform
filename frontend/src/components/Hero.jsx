"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const Hero = () => {
  return (
    <section
      id="home"
      className="pt-24 pb-16 px-4 min-h-[90vh] flex items-center bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full"
          style={{ filter: "blur(80px)", transform: "translate(30%, -30%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full"
          style={{ filter: "blur(80px)", transform: "translate(-30%, 30%)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", delay: 2 }}
        />
        {/* Remove the world map background div */}
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Make a Difference Today
          </motion.span>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Together We Can Create a Better World
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Join us in making a positive impact. Every donation, no matter how small, helps us build a brighter future
            for those in need.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.button
              className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Donate Now
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="px-8 py-3 border-2 border-blue-400 text-blue-100 rounded-full hover:bg-blue-500/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

