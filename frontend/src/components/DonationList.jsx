"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, AlertCircle } from "lucide-react"

const DonationList = ({ causeId }) => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDonations = async () => {
      if (!causeId) {
        console.error("No causeId provided to DonationList component")
        setError("Missing cause ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log(`Fetching donations for cause: ${causeId}`)

        const response = await fetch(`http://localhost:5001/api/donations/cause/${causeId}`)
        console.log(`Response status: ${response.status}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Error response: ${errorText}`)
          throw new Error(`Failed to fetch donations: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`Received ${data.length} donations:`, data)

        setDonations(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching donations:", error)
        setError(`Failed to load donations: ${error.message}`)

        // Use mock data as fallback
        setDonations([
          {
            _id: "mock1",
            amount: 50,
            isAnonymous: false,
            donor: {
              firstName: "John",
              lastName: "D.",
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          },
          {
            _id: "mock2",
            amount: 100,
            isAnonymous: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    if (causeId) {
      fetchDonations()
    }
  }, [causeId])

  if (loading) {
    return (
      <div className="bg-blue-900/30 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Supporters</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-800/50 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-blue-800/50 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-blue-800/50 rounded w-1/4"></div>
              </div>
              <div className="h-5 bg-blue-800/50 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Always show something, even if there's an error or no donations
  return (
    <div className="bg-blue-900/30 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Supporters</h3>

      {error && (
        <div className="flex items-center text-blue-200 mb-4">
          <AlertCircle className="h-5 w-5 mr-2 text-blue-300" />
          <p>{error}</p>
        </div>
      )}

      {!donations || donations.length === 0 ? (
        <p className="text-blue-200">Be the first to donate to this cause!</p>
      ) : (
        <div className="space-y-4">
          {donations.slice(0, 5).map((donation, index) => (
            <motion.div
              key={donation._id || index}
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-700/50 flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5 text-pink-300" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {donation.isAnonymous || !donation.donor
                      ? "Anonymous"
                      : `${donation.donor.firstName || "Donor"} ${donation.donor.lastName || ""}`}
                  </p>
                  <p className="text-xs text-blue-300">{new Date(donation.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="font-semibold text-white">${donation.amount.toFixed(2)}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DonationList

