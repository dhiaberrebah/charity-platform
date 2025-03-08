"use client"

import { useState, useEffect } from "react"
import CauseCard from "./CauseCard"

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
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Featured Causes</h2>

      {loading && (
        <div className="text-center py-10">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-gray-600">Loading causes...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && causes.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600">No causes found. Check back later!</p>
        </div>
      )}

      {!loading && !error && causes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {causes.map((cause) => (
            <CauseCard
              key={cause._id}
              id={cause._id}
              title={cause.title}
              description={cause.description}
              image={getImageUrl(cause)}
              raised={cause.currentAmount || 0}
              goal={cause.targetAmount}
              category={cause.category}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CausesSection

