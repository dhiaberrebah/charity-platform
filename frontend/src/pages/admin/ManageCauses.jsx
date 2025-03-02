"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Trash2, PlusCircle } from "lucide-react"
import { Link } from "react-router-dom"

const ManageCauses = () => {
  const [causes, setCauses] = useState([])

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const response = await fetch("/api/causes")
        const data = await response.json()
        setCauses(data)
      } catch (error) {
        console.error("Error fetching causes:", error)
      }
    }

    fetchCauses()
  }, [])

  const handleDeleteCause = async (causeId) => {
    if (window.confirm("Are you sure you want to delete this cause?")) {
      try {
        await fetch(`/api/causes/${causeId}`, { method: "DELETE" })
        setCauses(causes.filter((cause) => cause.id !== causeId))
      } catch (error) {
        console.error("Error deleting cause:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Causes</h1>
          <Link to="/admin/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Cause List</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center">
              <PlusCircle size={20} className="mr-2" />
              Add New Cause
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Goal</th>
                  <th className="p-3">Raised</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {causes.map((cause) => (
                  <tr key={cause.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{cause.title}</td>
                    <td className="p-3">{cause.description.substring(0, 50)}...</td>
                    <td className="p-3">${cause.goal.toLocaleString()}</td>
                    <td className="p-3">${cause.raised.toLocaleString()}</td>
                    <td className="p-3">
                      <button className="text-blue-500 hover:text-blue-700 mr-3">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCause(cause.id)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
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

export default ManageCauses

