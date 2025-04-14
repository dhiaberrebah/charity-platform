"use client"

import { useState } from "react"
import { X, Edit, Check, AlertCircle, Calendar, User, Target, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

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
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90 
                   rounded-2xl overflow-hidden border border-blue-500/20
                   shadow-xl shadow-blue-500/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-300 hover:text-blue-100 
                     bg-blue-500/10 hover:bg-blue-500/20 rounded-full p-2
                     transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-blue-300 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedCause.title}
                  onChange={handleInputChange}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-lg px-4 py-2
                           text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-400"
                  placeholder="Enter cause title"
                />
                {errors.title && <span className="text-red-400 text-sm">{errors.title}</span>}
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={editedCause.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-lg px-4 py-2
                           text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-400"
                  placeholder="Enter cause description"
                />
                {errors.description && <span className="text-red-400 text-sm">{errors.description}</span>}
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-medium mb-2">Target Amount</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={editedCause.targetAmount}
                  onChange={handleInputChange}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-lg px-4 py-2
                           text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-400"
                  placeholder="Enter target amount"
                />
                {errors.targetAmount && <span className="text-red-400 text-sm">{errors.targetAmount}</span>}
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
                <Button
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
                           text-white shadow-lg shadow-blue-500/20"
                  onClick={handleSave}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {cause.image && (
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <img
                    src={cause.image.startsWith("http")
                      ? cause.image
                      : `http://localhost:5001/uploads/${cause.image.split("/").pop()}`
                    }
                    alt={cause.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image load error for:", e.target.src)
                      e.target.src = "https://placehold.co/600x400/1e3a8a/ffffff?text=Image+Not+Available"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      cause.status
                    )}`}
                  >
                    {getStatusText(cause.status)}
                  </span>
                  <span className="text-blue-300 text-sm">
                    Created on {formatDate(cause.createdAt)}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white">{cause.title}</h2>
                
                <p className="text-blue-200/80 leading-relaxed">
                  {cause.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm text-blue-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-400" />
                      <span>Raised: ${(cause.currentAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span>Goal: ${(cause.targetAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="relative pt-2">
                    <Progress
                      value={(cause.currentAmount / cause.targetAmount) * 100 || 0}
                      className="h-2 bg-blue-950/50"
                    />
                    <span className="absolute right-0 -top-1 text-xs text-blue-300">
                      {((cause.currentAmount / cause.targetAmount) * 100 || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      onClick={handleEditToggle}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
                               text-white shadow-lg shadow-blue-500/20"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Cause
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CauseDetails

