"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Trash2, PlusCircle, X } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import CauseDetails from "@/components/CauseDetails"

// Inline AddCauseModal component to avoid import issues
const AddCauseModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: 1000,
    currentAmount: 0,
    category: "education",
    image: "", // Changed from imageUrl to image to match the backend model
    status: "pending",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    // Convert targetAmount to number
    if (name === "targetAmount") {
      processedValue = Number.parseFloat(value) || 0
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.targetAmount <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Generate a unique submission ID
      const submissionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create FormData object for multer
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("category", formData.category)
      formDataObj.append("targetAmount", formData.targetAmount)
      formDataObj.append("submissionId", submissionId) // Important: Add the submission ID

      // If there's an image URL, add it
      if (formData.image) {
        formDataObj.append("imageUrl", formData.image)
      }

      console.log("Submitting cause with ID:", submissionId)

      await onAdd(formDataObj)

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        targetAmount: 1000,
        currentAmount: 0,
        category: "education",
        image: "",
        status: "pending",
      })
    } catch (error) {
      console.error("Error in form submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Add New Cause</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg ${errors.title ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter cause title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full p-2 border rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter cause description"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount ($)</label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              min="1"
              step="0.01"
              className={`w-full p-2 border rounded-lg ${errors.targetAmount ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter target amount"
            />
            {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="environment">Environment</option>
              <option value="poverty">Poverty</option>
              <option value="disaster">Disaster Relief</option>
              <option value="animals">Animal Welfare</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter image URL (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Cause"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ManageCauses = () => {
  const [causes, setCauses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCause, setSelectedCause] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

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

  const handleOpenAddModal = () => {
    console.log("Opening add modal")
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAddCause = async (createdCause) => {
    try {
      // The cause has already been created by the modal
      // Just update the state
      setCauses((prevCauses) => [...prevCauses, createdCause])
      toast.success("Cause created successfully")
      setIsAddModalOpen(false)

      // Refresh the causes list
      const refreshResponse = await fetch("http://localhost:5001/api/causes", {
        credentials: "include",
      })
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json()
        setCauses(refreshedData)
      }
    } catch (error) {
      console.error("Error updating causes list:", error)
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
            <button
              type="button"
              onClick={() => {
                console.log("Button clicked")
                handleOpenAddModal()
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
            >
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
      {isAddModalOpen && <AddCauseModal onClose={handleCloseAddModal} onAdd={handleAddCause} />}
    </div>
  )
}

export default ManageCauses

