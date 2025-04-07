"use client"

import { useState } from "react"
import { X, Edit, Check, AlertCircle, Calendar, User, Target, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const CauseDetails = ({ cause, onClose, isAdmin, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCause, setEditedCause] = useState({ ...cause })
  const [errors, setErrors] = useState({})

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    setEditedCause({ ...cause })
    setErrors({})
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedCause({ ...editedCause, [name]: value })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!editedCause.title.trim()) newErrors.title = "Title is required"
    if (!editedCause.description.trim()) newErrors.description = "Description is required"
    if (!editedCause.targetAmount || isNaN(editedCause.targetAmount) || Number(editedCause.targetAmount) <= 0) {
      newErrors.targetAmount = "Please enter a valid amount"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return
    onEdit(editedCause)
    setIsEditing(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-300 bg-green-900/30 border border-green-500/30"
      case "pending":
        return "text-yellow-300 bg-yellow-900/30 border border-yellow-500/30"
      case "rejected":
        return "text-red-300 bg-red-900/30 border border-red-500/30"
      default:
        return "text-gray-300 bg-gray-900/30 border border-gray-500/30"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "pending":
        return "Pending"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  const progress = Math.min((cause.currentAmount / cause.targetAmount) * 100, 100)

  return (
    <div className="fixed inset-0 z-50">
      {/* Background overlay - updated to match the blue theme */}
      <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm" onClick={onClose} />

      {/* Content container - positioned a bit lower */}
      <div className="fixed inset-0 flex items-start justify-center pt-20 p-4">
        <div className="relative bg-blue-800/30 backdrop-blur-sm border border-blue-500/20 w-full max-w-4xl mx-auto rounded-lg shadow-xl max-h-[90vh] overflow-y-auto text-white">
          {/* Header */}
          <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-sm border-b border-blue-500/20">
            <h2 className="text-2xl font-bold text-white">Détails de la Cause</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-blue-300 hover:text-blue-100 hover:bg-blue-700/50 p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{isEditing ? "Edit Cause" : "Cause Details"}</h2>
                <div className="flex items-center space-x-2">
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-400 text-blue-300 hover:bg-blue-700/50"
                      onClick={handleEditToggle}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-blue-100 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editedCause.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-500/30 bg-blue-900/30 text-white ${
                        errors.title ? "border-red-500" : ""
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-blue-100 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editedCause.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-500/30 bg-blue-900/30 text-white ${
                        errors.description ? "border-red-500" : ""
                      }`}
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-blue-100 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={editedCause.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-500/30 bg-blue-900/30 text-white"
                    >
                      <option value="education">Education</option>
                      <option value="health">Health</option>
                      <option value="environment">Environment</option>
                      <option value="animals">Animals</option>
                      <option value="humanitarian">Humanitarian</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="targetAmount" className="block text-sm font-medium text-blue-100 mb-1">
                      Target Amount (DH)
                    </label>
                    <input
                      type="number"
                      id="targetAmount"
                      name="targetAmount"
                      value={editedCause.targetAmount}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-500/30 bg-blue-900/30 text-white ${
                        errors.targetAmount ? "border-red-500" : ""
                      }`}
                      min="1"
                      step="1"
                    />
                    {errors.targetAmount && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.targetAmount}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditToggle}
                      className="border-blue-400 text-blue-300 hover:bg-blue-700/50"
                    >
                      Cancel
                    </Button>
                    <Button type="button" className="bg-blue-600 hover:bg-blue-500 text-white" onClick={handleSave}>
                      <Check className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {cause.image && (
                    <div className="mb-6">
                      <img
                        src={
                          cause.image.startsWith("http")
                            ? cause.image
                            : `http://localhost:5001/uploads/${cause.image.split("/").pop()}`
                        }
                        alt={cause.title}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          console.log("Image load error for:", e.target.src)
                          e.target.src = "https://placehold.co/600x400/3b82f6/ffffff?text=Image+Not+Available"
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        cause.status,
                      )}`}
                    >
                      {getStatusText(cause.status)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{cause.title}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-blue-200">
                      <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-sm">Created: {formatDate(cause.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-blue-200">
                      <User className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-sm">
                        By: {cause.createdBy?.nom} {cause.createdBy?.prenom}
                      </span>
                    </div>
                    <div className="flex items-center text-blue-200">
                      <Target className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-sm">Category: {cause.category}</span>
                    </div>
                    <div className="flex items-center text-blue-200">
                      <DollarSign className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-sm">
                        Raised: {cause.currentAmount} DH of {cause.targetAmount} DH
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-blue-200">Progress</span>
                      <span className="text-sm text-blue-200">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="bg-blue-900/20 p-4 rounded-lg mb-6 border border-blue-500/20">
                    <h4 className="font-medium text-blue-100 mb-2">Description</h4>
                    <p className="text-blue-200 whitespace-pre-line">{cause.description}</p>
                  </div>

                  {isAdmin && (
                    <div className="border-t border-blue-500/20 pt-4">
                      <h4 className="font-medium text-blue-100 mb-2">Admin Actions</h4>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="border-green-400 text-green-300 hover:bg-green-900/30"
                          onClick={() => onEdit({ ...cause, status: "approved" })}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-400 text-red-300 hover:bg-red-900/30"
                          onClick={() => onEdit({ ...cause, status: "rejected" })}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CauseDetails

