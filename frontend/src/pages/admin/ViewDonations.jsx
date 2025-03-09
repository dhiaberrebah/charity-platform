"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const ViewDonations = () => {
  const [donations, setDonations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("/api/donations")
        const data = await response.json()
        setDonations(data)
      } catch (error) {
        console.error("Error fetching donations:", error)
      }
    }

    fetchDonations()
  }, [])

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.cause.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">View Donations</h1>
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/admin/dashboard"
              className="flex items-center text-blue-300 hover:text-blue-100 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Donation List</h2>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search donations..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder:text-blue-200/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
              </div>
              <motion.button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} className="mr-2" />
                Export CSV
              </motion.button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-800/50">
                  <th className="p-3 text-blue-100">Donor</th>
                  <th className="p-3 text-blue-100">Cause</th>
                  <th className="p-3 text-blue-100">Amount</th>
                  <th className="p-3 text-blue-100">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation, index) => (
                  <motion.tr
                    key={donation.id}
                    className="border-b border-blue-700/30 hover:bg-blue-800/30 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <td className="p-3">{donation.donor}</td>
                    <td className="p-3">{donation.cause}</td>
                    <td className="p-3 text-blue-300">${donation.amount.toLocaleString()}</td>
                    <td className="p-3">{new Date(donation.date).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
                {filteredDonations.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <td colSpan="4" className="p-6 text-center text-blue-200">
                      No donations found matching your search criteria.
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ViewDonations

