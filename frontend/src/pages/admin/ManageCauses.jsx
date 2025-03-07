"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Trash2, PlusCircle } from 'lucide-react'
import { Link } from "react-router-dom"
import { toast } from "sonner"
import CauseDetails from "@/components/CauseDetails"

const ManageCauses = () => {
  const [causes, setCauses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCause, setSelectedCause] = useState(null)

  useEffect(() => {
    const fetchCauses = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:5001/api/causes", {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch causes")
        }
        const data = await response.json()
        console.log("Fetched causes:", data)
        setCauses(data)
      } catch (error) {
        console.error("Error fetching causes:", error)
        toast.error("Failed to load causes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCauses()
  }, [])

  const handleDeleteCause = async (causeId) => {
    if (window.confirm("Are you sure you want to delete this cause?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/causes/${causeId}`, {
          method: "DELETE",
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to delete cause")
        }
        setCauses((prevCauses) => prevCauses.filter((cause) => cause._id !== causeId))
        toast.success("Cause deleted successfully")
      } catch (error) {
        console.error("Error deleting cause:", error)
        toast.error("Failed to delete cause")
      }
    }
  }

  const handleUpdateStatus = async (causeId, newStatus) => {
    try {
      console.log("Updating cause:", causeId)
      console.log("New status:", newStatus)

      const response = await fetch(`http://localhost:5001/api/causes/${causeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      })

      console.log("Response status:", response.status)
      const updatedCause = await response.json()
      console.log("Received updated cause:", updatedCause)

      if (!response.ok) {
        throw new Error(updatedCause.message || "Failed to update cause status")
      }

      if (updatedCause.status !== newStatus) {
        throw new Error("Status was not updated on the server")
      }

      setCauses((prevCauses) => {
        const newCauses = prevCauses.map((cause) => (cause._id === causeId ? updatedCause : cause))
        console.log("New causes state:", newCauses)
        return [...newCauses] // Create a new array to force re-render
      })
      toast.success(`Cause status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating cause status:", error)
      toast.error(`Failed to update cause status: ${error.message}`)
    }
  }

  const handleViewDetails = (cause) => {
    setSelectedCause(cause)
  }

  const handleCloseDetails = () => {
    setSelectedCause(null)
  }

  const handleEditCause = async (editedCause) => {
    try {
      const response = await fetch(`http://localhost:5001/api/causes/${editedCause._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCause),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to update cause")
      }

      const updatedCause = await response.json()
      setCauses((prevCauses) => prevCauses.map((cause) => (cause._id === updatedCause._id ? updatedCause : cause)))
      toast.success("Cause updated successfully")
      setSelectedCause(null)
    } catch (error) {
      console.error("Error updating cause:", error)
      toast.error("Failed to update cause: " + error.message)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
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
                  <th className="p-3">Target Amount</th>
                  <th className="p-3">Current Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {causes.map((cause) => (
                  <tr key={cause._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{cause.title}</td>
                    <td className="p-3">{cause.description.substring(0, 50)}...</td>
                    <td className="p-3">${cause.targetAmount.toLocaleString()}</td>
                    <td className="p-3">${cause.currentAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <select
                        value={cause.status}
                        onChange={(e) => handleUpdateStatus(cause._id, e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-3"
                        onClick={() => handleViewDetails(cause)}
                      >
                        <Edit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCause(cause._id)}>
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
      {selectedCause && (
        <CauseDetails cause={selectedCause} onClose={handleCloseDetails} isAdmin={true} onEdit={handleEditCause} />
      )}
    </div>
  )
}

export default ManageCauses