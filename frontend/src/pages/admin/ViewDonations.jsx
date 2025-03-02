"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, Search } from "lucide-react"
import { Link } from "react-router-dom"

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">View Donations</h1>
          <Link to="/admin/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Donation List</h2>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search donations..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center">
                <Download size={20} className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Donor</th>
                  <th className="p-3">Cause</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{donation.donor}</td>
                    <td className="p-3">{donation.cause}</td>
                    <td className="p-3">${donation.amount.toLocaleString()}</td>
                    <td className="p-3">{new Date(donation.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewDonations

