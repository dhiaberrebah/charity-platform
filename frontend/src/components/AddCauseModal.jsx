"use client"

import { useState } from "react"
import { X, Upload } from "lucide-react"

const AddCauseModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: 1000,
    currentAmount: 0,
    category: "education",
    status: "pending",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
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
    setUploadProgress(0)

    try {
      // Generate a unique submission ID
      const submissionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create FormData object for multer
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("category", formData.category)
      formDataObj.append("targetAmount", formData.targetAmount)
      formDataObj.append("submissionId", submissionId)

      // If there's an image file, add it
      if (imageFile) {
        formDataObj.append("image", imageFile)
      }

      console.log("Submitting cause with ID:", submissionId)

      // Create a custom fetch with upload progress
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "http://localhost:5001/api/causes", true)
      xhr.withCredentials = true // For cookies

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success
          let response
          try {
            response = JSON.parse(xhr.responseText)
          } catch (e) {
            response = { message: xhr.responseText }
          }

          // Reset form after successful submission
          setFormData({
            title: "",
            description: "",
            targetAmount: 1000,
            currentAmount: 0,
            category: "education",
            status: "pending",
          })
          setImageFile(null)
          setImagePreview(null)
          setUploadProgress(0)

          onAdd(response)
        } else {
          // Error
          let errorMessage
          try {
            const response = JSON.parse(xhr.responseText)
            errorMessage = response.message || "Failed to create cause"
          } catch (e) {
            errorMessage = "Failed to create cause"
          }

          throw new Error(errorMessage)
        }

        setIsSubmitting(false)
      }

      xhr.onerror = () => {
        setIsSubmitting(false)
        throw new Error("Network error occurred")
      }

      xhr.send(formDataObj)
    } catch (error) {
      console.error("Error in form submission:", error)
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="mt-1 flex items-center">
              <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-lg border border-blue-500 cursor-pointer hover:bg-blue-50">
                <Upload size={20} />
                <span className="mt-2 text-sm">Select Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <div className="ml-4">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
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

          {isSubmitting && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}

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

export default AddCauseModal

