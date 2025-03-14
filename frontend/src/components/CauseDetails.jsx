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
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "rejected":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
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
      {/* Background overlay */}
      <div className="fixed inset-0 bg-blue-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Content container - positioned a bit lower */}
      <div className="fixed inset-0 flex items-start justify-center pt-20 p-4">
        <div className="relative bg-white w-full max-w-4xl mx-auto rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900">Détails de la Cha9a9a</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-900">{isEditing ? "Edit Cause" : "Cause Details"}</h2>
                <div className="flex items-center space-x-2">
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-500 border-blue-500 hover:bg-blue-50"
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
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editedCause.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editedCause.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.description ? "border-red-500" : "border-gray-300"
                      }`}
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={editedCause.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Amount (DH)
                    </label>
                    <input
                      type="number"
                      id="targetAmount"
                      name="targetAmount"
                      value={editedCause.targetAmount}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.targetAmount ? "border-red-500" : "border-gray-300"
                      }`}
                      min="1"
                      step="1"
                    />
                    {errors.targetAmount && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
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
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button type="button" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSave}>
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

                  <h3 className="text-xl font-bold text-blue-900 mb-2">{cause.title}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">Created: {formatDate(cause.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">
                        By: {cause.createdBy?.nom} {cause.createdBy?.prenom}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Target className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">Category: {cause.category}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">
                        Raised: {cause.currentAmount} DH of {cause.targetAmount} DH
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm text-gray-600">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 whitespace-pre-line">{cause.description}</p>
                  </div>

                  {isAdmin && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Admin Actions</h4>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => onEdit({ ...cause, status: "approved" })}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
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

