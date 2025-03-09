"use client"

import { useState, useEffect } from "react"
import CauseCard from "./CauseCard"
import { motion } from "framer-motion"

const CausesSection = () => {
  const [causes, setCauses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:5001/api/causes", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch causes")
        }

        const data = await response.json()
        console.log("Fetched causes:", data)

        // Filter to only show approved causes
        const approvedCauses = data.filter((cause) => cause.status === "approved")
        setCauses(approvedCauses)
        setError(null)
      } catch (error) {
        console.error("Error fetching causes:", error)
        setError("Failed to load causes. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCauses()
  }, [])

  // Function to get the image URL
  const getImageUrl = (cause) => {
    // If the image is a full URL (like from Cloudinary), use it directly
    if (cause.image && (cause.image.startsWith("http://") || cause.image.startsWith("https://"))) {
      return cause.image
    }

    // If it's a relative path (like from local uploads), prepend the server URL
    if (cause.image) {
      return `http://localhost:5001/${cause.image}`
    }

    // Fallback image - use a reliable placeholder service
    return "https://placehold.co/600x400/png?text=No+Image"
  }

  return (
    <motion.div 
      className="container mx-auto py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-6 text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Featured Causes
      </motion.h2>

      {loading && (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-300 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-blue-200">Loading causes...</p>
        </motion.div>
      )}

      {error && (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-red-300">{error}</p>
        </motion.div>
      )}

      {!loading && !error && causes.length === 0 && (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-blue-200">No causes found. Check back later!</p>
        </motion.div>
      )}

      {!loading && !error && causes.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {causes.map((cause, index) => (
            <motion.div
              key={cause._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <CauseCard
                id={cause._id}
                title={cause.title}
                description={cause.description}
                image={getImageUrl(cause)}
                raised={cause.currentAmount || 0}
                goal={cause.targetAmount}
                category={cause.category}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default CausesSection

