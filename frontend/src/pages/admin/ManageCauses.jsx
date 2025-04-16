"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, Edit, Trash2, PlusCircle, X, Upload, ImageIcon, LinkIcon, Search, Filter, FileDown, RefreshCw, Copy } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import CauseDetails from "@/components/CauseDetails"
import { useCauseProgress } from '../../hooks/useCauseProgress';

// Inline AddCauseModal component with file upload functionality
const AddCauseModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: 1000,
    currentAmount: 0,
    category: "education",
    image: "", // URL for remote images
    status: "pending",
    url: "", // New URL field
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileInputRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB")
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)

    // Clear the image URL field since we're using a file upload
    setFormData((prev) => ({
      ...prev,
      image: "",
    }))
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl("")
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageUrlChange = (e) => {
    // If user enters a URL, clear any selected file
    if (e.target.value) {
      handleRemoveFile()
    }
    handleChange(e)
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

    // Validate URL if provided
    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Helper function to validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
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
      formDataObj.append("submissionId", submissionId)
      formDataObj.append("status", formData.status)

      // Add the URL if provided
      if (formData.url) {
        formDataObj.append("url", formData.url)
      }

      // If there's an image URL, add it
      if (formData.image) {
        formDataObj.append("imageUrl", formData.image)
      }

      // If there's a file selected, add it
      if (selectedFile) {
        formDataObj.append("image", selectedFile)
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
        url: "",
      })
      handleRemoveFile()
    } catch (error) {
      console.error("Error in form submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-500/30 text-white"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-blue-500/30">
          <h2 className="text-2xl font-bold text-white">Add New Cause</h2>
          <motion.button
            onClick={onClose}
            className="text-blue-200 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 bg-white/10 border rounded-lg ${errors.title ? "border-red-500" : "border-blue-500/30"} text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
              placeholder="Enter cause title"
            />
            {errors.title && <p className="text-red-300 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full p-2 bg-white/10 border rounded-lg ${errors.description ? "border-red-500" : "border-blue-500/30"} text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
              placeholder="Enter cause description"
            ></textarea>
            {errors.description && <p className="text-red-300 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Target Amount ($)</label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              min="1"
              step="0.01"
              className={`w-full p-2 bg-white/10 border rounded-lg ${errors.targetAmount ? "border-red-500" : "border-blue-500/30"} text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
              placeholder="Enter target amount"
            />
            {errors.targetAmount && <p className="text-red-300 text-sm mt-1">{errors.targetAmount}</p>}
          </div>

          {/* New URL field */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">URL (Optional)</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-500/30 bg-white/10 text-blue-300">
                <LinkIcon size={18} />
              </span>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className={`w-full p-2 bg-white/10 border rounded-r-lg ${errors.url ? "border-red-500" : "border-blue-500/30"} text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                placeholder="https://example.com"
              />
            </div>
            {errors.url && <p className="text-red-300 text-sm mt-1">{errors.url}</p>}
            <p className="text-xs text-blue-300 mt-1">Add an external link related to this cause (optional)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1">Image</label>

              {/* Image upload section */}
              <div
                className={`border ${errors.image ? "border-red-500" : "border-blue-500/30"} rounded-lg p-4 bg-white/5`}
              >
                <div className="flex flex-col space-y-4">
                  {/* File upload button */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-500/30 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-blue-300" />
                        <p className="mb-2 text-sm text-blue-300">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-blue-400">PNG, JPG, GIF or WEBP (MAX. 5MB)</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Preview section */}
                  {previewUrl && (
                    <div className="relative mt-2 w-full h-40 bg-white/5 rounded-lg overflow-hidden">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="object-contain w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600/80"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-blue-500/30"></div>
                    <span className="flex-shrink mx-4 text-blue-300 text-sm">OR</span>
                    <div className="flex-grow border-t border-blue-500/30"></div>
                  </div>

                  {/* Image URL input */}
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Image URL</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-500/30 bg-white/10 text-blue-300">
                        <ImageIcon size={18} />
                      </span>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleImageUrlChange}
                        className="w-full p-2 bg-white/10 border border-blue-500/30 rounded-r-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {errors.image && <p className="text-red-300 text-sm mt-1">{errors.image}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-blue-500/30">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-blue-500/50 rounded-lg text-blue-100 hover:bg-blue-800/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? "Creating..." : "Create Cause"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

const CauseRow = ({ cause, handleDeleteCause, handleUpdateStatus, handleViewDetails }) => {
  const { data: progressData } = useCauseProgress(cause._id);
  const currentAmount = progressData?.currentAmount || cause.currentAmount;

  return (
    <motion.tr
      className="border-b border-blue-700/30 hover:bg-blue-800/30 text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <td className="p-3">{cause.title}</td>
      <td className="p-3">{cause.description.substring(0, 50)}...</td>
      <td className="p-3">${cause.targetAmount.toLocaleString()}</td>
      <td className="p-3">${currentAmount.toLocaleString()}</td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono">{cause.RIB}</code>
          <motion.button
            onClick={() => {
              navigator.clipboard.writeText(cause.RIB);
              toast.success("RIB copied!");
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Copy className="w-4 h-4 text-blue-400" />
          </motion.button>
        </div>
      </td>
      <td className="p-3">
        <select
          value={cause.status}
          onChange={(e) => handleUpdateStatus(cause._id, e.target.value)}
          className="bg-white/10 border border-blue-500/30 rounded p-1 text-white focus:outline-none focus:border-blue-400"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </td>
      <td className="p-3 flex">
        <motion.button
          className="text-blue-300 hover:text-blue-100 mr-3"
          onClick={() => handleViewDetails(cause)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Edit size={18} />
        </motion.button>
        <motion.button
          className="text-red-400 hover:text-red-300"
          onClick={() => handleDeleteCause(cause._id)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={18} />
        </motion.button>
      </td>
    </motion.tr>
  );
};

const ManageCauses = () => {
  const [causes, setCauses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCause, setSelectedCause] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportAttempts, setExportAttempts] = useState(0)
  const [pollingInterval, setPollingInterval] = useState(null)

  const handleExportWithRetry = async (exportFunction, maxAttempts = 3) => {
    setIsExporting(true)
    setExportAttempts(prev => prev + 1)

    try {
      await exportFunction()
      setExportAttempts(0) // Reset attempts on success
    } catch (error) {
      console.error('Export error:', error)
      
      if (exportAttempts < maxAttempts) {
        toast.error(`Export failed. Retrying... (Attempt ${exportAttempts + 1}/${maxAttempts})`)
        setTimeout(() => handleExportWithRetry(exportFunction, maxAttempts), 1500)
      } else {
        toast.error('Export failed after multiple attempts. Please try again later.')
        setExportAttempts(0)
      }
    } finally {
      setIsExporting(false)
    }
  }

  const exportToCSV = () => {
    return new Promise((resolve, reject) => {
      try {
        const headers = ['Title', 'Description', 'Target Amount', 'Current Amount', 'Category', 'Status', 'Created At']
        const csvContent = [
          headers.join(','),
          ...causes.map(cause => [
            cause.title,
            cause.description,
            cause.targetAmount,
            cause.currentAmount,
            cause.category,
            cause.status,
            new Date(cause.createdAt).toLocaleDateString()
          ].map(field => `"${field}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `causes_export_${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
        toast.success('Causes exported to CSV successfully')
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  const exportToPDF = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { jsPDF } = await import('jspdf')
        const { autoTable } = await import('jspdf-autotable')
        
        const doc = new jsPDF()
        
        doc.setTextColor(91, 168, 144)
        doc.setFontSize(16)
        doc.text('Causes Report', 14, 15)
        doc.setFontSize(10)
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22)

        const data = causes.map(cause => [
          cause.title,
          cause.description.substring(0, 50) + '...',
          `$${cause.targetAmount.toLocaleString()}`,
          `$${cause.currentAmount.toLocaleString()}`,
          cause.category,
          cause.status,
          new Date(cause.createdAt).toLocaleDateString()
        ])

        autoTable(doc, {
          head: [['Title', 'Description', 'Target Amount', 'Current Amount', 'Category', 'Status', 'Created At']],
          body: data,
          startY: 30,
          styles: { fontSize: 8, textColor: [31, 41, 55] },
          headStyles: { fillColor: [91, 168, 144], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [243, 244, 246] },
          margin: { top: 30 }
        })

        doc.save(`causes_report_${new Date().toISOString().slice(0, 10)}.pdf`)
        toast.success('Causes exported to PDF successfully')
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Separate function to fetch a single cause's current amount
  const fetchCauseAmount = useCallback(async (causeId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/causes/${causeId}/progress`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch cause progress")
      const data = await response.json()
      return data.currentAmount
    } catch (error) {
      console.error("Error fetching cause amount:", error)
      return null
    }
  }, [])

  // Function to update all causes' current amounts
  const updateCausesAmounts = useCallback(async () => {
    const updatedCauses = await Promise.all(
      causes.map(async (cause) => {
        const currentAmount = await fetchCauseAmount(cause._id)
        return currentAmount !== null
          ? { ...cause, currentAmount }
          : cause
      })
    )

    // Only update state if there are actual changes
    const hasChanges = updatedCauses.some(
      (updatedCause, index) => updatedCause.currentAmount !== causes[index].currentAmount
    )

    if (hasChanges) {
      setCauses(updatedCauses)
    }
  }, [causes, fetchCauseAmount])

  useEffect(() => {
    // Initial fetch
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
        setCauses(data)
      } catch (error) {
        console.error("Error fetching causes:", error)
        toast.error("Failed to load causes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCauses()

    // Set up polling for real-time updates
    const interval = setInterval(updateCausesAmounts, 5000) // Poll every 5 seconds
    setPollingInterval(interval)

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [])

  // Update polling when causes change
  useEffect(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }
    const interval = setInterval(updateCausesAmounts, 5000)
    setPollingInterval(interval)

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [causes, updateCausesAmounts])

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

  const handleAddCause = async (formData) => {
    try {
      const response = await fetch("http://localhost:5001/api/causes", {
        method: "POST",
        body: formData, // FormData with file will be sent directly
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to create cause")
      }

      const createdCause = await response.json()
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
      console.error("Error creating cause:", error)
      toast.error("Failed to create cause: " + error.message)
    }
  }

  // Animated floating hearts for background
  const renderFloatingHearts = () => {
    const hearts = Array(8)
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

    return hearts.map((heart) => (
      <motion.div
        key={heart.id}
        className="absolute text-blue-300 pointer-events-none"
        style={{
          fontSize: heart.size,
          left: `${heart.x}%`,
          top: `${heart.y}%`,
          opacity: 0,
          zIndex: 0,
        }}
        animate={{
          y: [0, -100],
          opacity: [0, heart.opacity, 0],
          scale: [0.5, 1, 0.8],
        }}
        transition={{
          duration: heart.duration,
          repeat: Number.POSITIVE_INFINITY,
          delay: heart.delay,
          ease: "easeInOut",
        }}
      >
        ❤️
      </motion.div>
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mb-4"></div>
          <p className="text-blue-100">Loading causes...</p>
        </div>
      </div>
    )
  }

  // Modify the table row to add animation when amount changes
  const renderAmount = (amount, previousAmount) => {
    const hasIncreased = amount > previousAmount
    const hasDecreased = amount < previousAmount
    
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={hasIncreased || hasDecreased ? { scale: [1, 1.1, 1] } : {}}
        className={`${hasIncreased ? 'text-green-400' : ''} ${hasDecreased ? 'text-red-400' : ''}`}
      >
        ${amount.toLocaleString()}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderFloatingHearts()}

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

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/src/assets/img/world-map-dots.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        ></div>
      </div>

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Causes</h1>
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
            <h2 className="text-xl font-semibold text-white">Cause List</h2>
            <div className="flex gap-2">
              {/* Export buttons */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExportWithRetry(exportToCSV)}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg flex items-center gap-2 border border-blue-500/30 transition-colors duration-200"
              >
                {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                Export CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExportWithRetry(exportToPDF)}
                disabled={isExporting}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg flex items-center gap-2 border border-purple-500/30 transition-colors duration-200"
              >
                {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                Export PDF
              </motion.button>
              {/* Add New Cause button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
              >
                Add New Cause
              </motion.button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-900/50">
                  <th className="p-3 text-blue-100">Title</th>
                  <th className="p-3 text-blue-100">Description</th>
                  <th className="p-3 text-blue-100">Target Amount</th>
                  <th className="p-3 text-blue-100">Current Amount</th>
                  <th className="p-3 text-blue-100">RIB</th>
                  <th className="p-3 text-blue-100">Status</th>
                  <th className="p-3 text-blue-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {causes.map((cause) => (
                  <CauseRow 
                    key={cause._id} 
                    cause={cause} 
                    handleDeleteCause={handleDeleteCause}
                    handleUpdateStatus={handleUpdateStatus}
                    handleViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedCause && (
          <CauseDetails cause={selectedCause} onClose={handleCloseDetails} isAdmin={true} onEdit={handleEditCause} />
        )}

        {isAddModalOpen && <AddCauseModal onClose={handleCloseAddModal} onAdd={handleAddCause} />}
      </AnimatePresence>
    </div>
  )
}

export default ManageCauses

