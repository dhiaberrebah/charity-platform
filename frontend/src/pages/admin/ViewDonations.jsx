"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Search, Filter, ChevronDown, ChevronUp, Eye, X } from 'lucide-react'
import { Link } from "react-router-dom"
import { toast } from "sonner"

const ViewDonations = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedDonation, setSelectedDonation] = useState(null)

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5001/api/donations", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch donations: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched donations:", data)
      setDonations(data)
      setError(null)
    } catch (error) {
      console.error("Error fetching donations:", error)
      setError("Failed to load donations. Please try again later.")
      toast.error("Failed to load donations")
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value)
  }

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation)
  }

  const handleCloseDetails = () => {
    setSelectedDonation(null)
  }

  const exportToCSV = () => {
    try {
      // Filter and sort the data first
      const dataToExport = getFilteredAndSortedDonations()
      
      // Convert to CSV
      const headers = ["Donation ID", "Cause", "Amount", "Donor", "Email", "Date", "Status"]
      const csvContent = [
        headers.join(","),
        ...dataToExport.map(donation => [
          donation._id,
          donation.cause?.title || donation.cause || "Unknown",
          `$${donation.amount.toFixed(2)}`,
          donation.isAnonymous ? "Anonymous" : `${donation.donor?.firstName || ""} ${donation.donor?.lastName || ""}`,
          donation.donor?.email || "",
          new Date(donation.createdAt).toLocaleDateString(),
          donation.status
        ].join(","))
      ].join("\n")
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `donations_export_${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Donations exported successfully")
    } catch (error) {
      console.error("Error exporting donations:", error)
      toast.error("Failed to export donations")
    }
  }

  const getFilteredAndSortedDonations = () => {
    // First filter by search term and status
    let filteredDonations = [...donations]
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredDonations = filteredDonations.filter(donation => 
        (donation.donor?.firstName?.toLowerCase().includes(term) || 
         donation.donor?.lastName?.toLowerCase().includes(term) ||
         donation.donor?.email?.toLowerCase().includes(term) ||
         donation._id.toLowerCase().includes(term) ||
         (donation.cause?.title && donation.cause.title.toLowerCase().includes(term)))
      )
    }
    
    if (filterStatus !== "all") {
      filteredDonations = filteredDonations.filter(donation => donation.status === filterStatus)
    }
    
    // Then sort
    return filteredDonations.sort((a, b) => {
      let valueA, valueB
      
      // Handle different field types
      switch (sortField) {
        case "amount":
          valueA = a.amount
          valueB = b.amount
          break
        case "donor":
          valueA = a.isAnonymous ? "Anonymous" : `${a.donor?.firstName || ""} ${a.donor?.lastName || ""}`
          valueB = b.isAnonymous ? "Anonymous" : `${b.donor?.firstName || ""} ${b.donor?.lastName || ""}`
          break
        case "cause":
          valueA = a.cause?.title || a.cause || ""
          valueB = b.cause?.title || b.cause || ""
          break
        case "createdAt":
        default:
          valueA = new Date(a.createdAt).getTime()
          valueB = new Date(b.createdAt).getTime()
      }
      
      // Compare based on direction
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
  }

  const renderSortIcon = (field) => {
    if (sortField !== field) return null
    
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />
  }

  // Animated floating elements for background
  const renderFloatingElements = () => {
    const elements = Array(8)
      .fill(0)
      .map((_, i) => ({
        id: i,
        size: Math.random() * 20 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.1 + 0.05,
      }))

    return elements.map((element) => (
      <motion.div
        key={element.id}
        className="absolute text-blue-300 pointer-events-none"
        style={{
          fontSize: element.size,
          left: `${element.x}%`,
          top: `${element.y}%`,
          opacity: 0,
          zIndex: 0,
        }}
        animate={{
          y: [0, -100],
          opacity: [0, element.opacity, 0],
          scale: [0.5, 1, 0.8],
        }}
        transition={{
          duration: element.duration,
          repeat: Number.POSITIVE_INFINITY,
          delay: element.delay,
          ease: "easeInOut",
        }}
      >
        💰
      </motion.div>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mb-4"></div>
          <p className="text-blue-100">Loading donations...</p>
        </div>
      </div>
    )
  }

  const filteredAndSortedDonations = getFilteredAndSortedDonations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderFloatingElements()}

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
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Donation Management</h1>
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
          className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-500/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-white">Donations List</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 w-full"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                <select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 appearance-none w-full"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
              </div>
              
              <motion.button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                Export CSV
              </motion.button>
            </div>
          </div>

          {error ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-white">
              <p>{error}</p>
              <button 
                onClick={fetchDonations} 
                className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-blue-800/50">
                      <th className="p-3 text-blue-100 cursor-pointer" onClick={() => handleSort("createdAt")}>
                        Date {renderSortIcon("createdAt")}
                      </th>
                      <th className="p-3 text-blue-100 cursor-pointer" onClick={() => handleSort("cause")}>
                        Cause {renderSortIcon("cause")}
                      </th>
                      <th className="p-3 text-blue-100 cursor-pointer" onClick={() => handleSort("amount")}>
                        Amount {renderSortIcon("amount")}
                      </th>
                      <th className="p-3 text-blue-100 cursor-pointer" onClick={() => handleSort("donor")}>
                        Donor {renderSortIcon("donor")}
                      </th>
                      <th className="p-3 text-blue-100">Email</th>
                      <th className="p-3 text-blue-100">Status</th>
                      <th className="p-3 text-blue-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedDonations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-blue-200">
                          No donations found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedDonations.map((donation, index) => (
                        <motion.tr
                          key={donation._id}
                          className="border-b border-blue-700/30 hover:bg-blue-800/30 text-white"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                        >
                          <td className="p-3">
                            {new Date(donation.createdAt).toLocaleDateString()}
                            <div className="text-xs text-blue-300">
                              {new Date(donation.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="p-3">
                            {donation.cause?.title || 
                             (typeof donation.cause === 'string' ? 
                              donation.cause.substring(0, 8) + '...' : 'Unknown')}
                          </td>
                          <td className="p-3 font-medium">${donation.amount.toFixed(2)}</td>
                          <td className="p-3">
                            {donation.isAnonymous ? (
                              <span className="italic text-blue-300">Anonymous</span>
                            ) : (
                              `${donation.donor?.firstName || ""} ${donation.donor?.lastName || ""}`
                            )}
                          </td>
                          <td className="p-3 text-blue-300">{donation.donor?.email || "N/A"}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                donation.status === "completed"
                                  ? "bg-green-500/20 text-green-300"
                                  : donation.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : donation.status === "failed"
                                  ? "bg-red-500/20 text-red-300"
                                  : "bg-gray-500/20 text-gray-300"
                              }`}
                            >
                              {donation.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <motion.button
                              className="p-1 bg-blue-700/50 hover:bg-blue-600/50 rounded-full"
                              onClick={() => handleViewDetails(donation)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Eye size={16} className="text-blue-200" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-blue-200 text-sm">
                Showing {filteredAndSortedDonations.length} of {donations.length} donations
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-blue-900">Donation Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Donation Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Donation ID</p>
                      <p className="text-gray-800 font-mono text-sm">{selectedDonation._id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-gray-800 font-bold text-xl">${selectedDonation.amount.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="text-gray-800">
                        {new Date(selectedDonation.createdAt).toLocaleDateString()} at{' '}
                        {new Date(selectedDonation.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${
                        selectedDonation.status === "completed"
                          ? "text-green-600"
                          : selectedDonation.status === "pending"
                          ? "text-yellow-600"
                          : selectedDonation.status === "failed"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}>
                        {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                      </p>
                    </div>
                    
                    {selectedDonation.transactionId && (
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="text-gray-800 font-mono text-sm">{selectedDonation.transactionId}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="text-gray-800 capitalize">{selectedDonation.paymentMethod || "Card"}</p>
                    </div>
                    
                    {selectedDonation.paymentDetails && (
                      <div>
                        <p className="text-sm text-gray-500">Card Details</p>
                        <p className="text-gray-800">
                          {selectedDonation.paymentDetails.cardName || "N/A"} •••• 
                          {selectedDonation.paymentDetails.last4 || "****"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Donor Information</h3>
                  
                  <div className="space-y-3">
                    {selectedDonation.isAnonymous ? (
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-gray-800 italic">This donation was made anonymously</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-gray-800">
                            {selectedDonation.donor?.firstName || ""} {selectedDonation.donor?.lastName || ""}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-800">{selectedDonation.donor?.email || "N/A"}</p>
                        </div>
                        
                        {selectedDonation.donor?.phone && (
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-800">{selectedDonation.donor.phone}</p>
                          </div>
                        )}
                        
                        {selectedDonation.donor?.address && (
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-gray-800">
                              {selectedDonation.donor.address}
                              {selectedDonation.donor.city && `, ${selectedDonation.donor.city}`}
                              {selectedDonation.donor.country && `, ${selectedDonation.donor.country}`}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    
                    {selectedDonation.message && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Message</p>
                        <div className="bg-gray-100 p-3 rounded-lg mt-1">
                          <p className="text-gray-800 italic">"{selectedDonation.message}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ViewDonations
