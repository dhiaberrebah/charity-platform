"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Check, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import NavigationBar from "@/components/NavigationBar"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

const CauseShare = () => {
  const { shareUrl } = useParams()
  const [cause, setCause] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchCause = async () => {
      try {
        setLoading(true)
        console.log("Fetching cause with shareUrl:", shareUrl)
        const response = await fetch(`http://localhost:5001/api/causes/share/${shareUrl}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch cause: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched cause data:", data)
        setCause(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching cause:", error)
        setError("This cause is not available or has been removed.")
      } finally {
        setLoading(false)
      }
    }

    if (shareUrl) {
      fetchCause()
    }
  }, [shareUrl])

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        toast.error("Failed to copy link")
      })
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const text = `Check out this cause: ${cause?.title}`

    let shareUrl

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      default:
        return
    }

    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  // Function to properly format image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null

    // If it's already a full URL with http:// or https://
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath
    }

    // Check if it's an absolute file system path (starts with / or contains :\)
    const isAbsolutePath =
      imagePath.startsWith("/") ||
      imagePath.includes(":\\") ||
      imagePath.includes("/Users/") ||
      imagePath.includes("/home/")

    if (isAbsolutePath) {
      // Extract just the filename from the path
      const filename = imagePath.split("/").pop().split("\\").pop()
      console.log("Extracted filename:", filename)

      // Use the filename with the uploads endpoint
      return `http://localhost:5001/uploads/${filename}`
    }

    // For relative paths, just append to the base URL
    return `http://localhost:5001/${imagePath.replace(/^\/+/, "")}`
  }

  // Handle image loading error
  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src)
    setImageError(true)
    // Use a placeholder image
    e.target.src = "https://placehold.co/600x400/3b82f6/ffffff?text=Image+Not+Available"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <NavigationBar />
        <div className="pt-24 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
        </div>
      </div>
    )
  }

  if (error || !cause) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <NavigationBar />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-blue-500/20">
            <h1 className="text-2xl font-bold mb-4">Cause Not Found</h1>
            <p className="text-blue-100 mb-6">{error || "This cause is not available or has been removed."}</p>
            <Link to="/causes">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Causes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const progress = Math.min((cause.currentAmount / cause.targetAmount) * 100, 100)
  const imageUrl = cause.image ? getImageUrl(cause.image) : null
  console.log("Image URL:", imageUrl)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <NavigationBar />
      <div className="pt-24 px-4 max-w-4xl mx-auto">
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-blue-500/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image section with better error handling */}
          <div className="w-full h-64 md:h-96 bg-blue-900/20 relative">
            {imageError || !imageUrl ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/50 text-blue-200">
                <ImageIcon size={48} className="mb-2 opacity-50" />
                <p className="text-sm opacity-70">Image not available</p>
              </div>
            ) : (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={cause.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <div className="inline-block bg-blue-500/90 text-white text-sm px-3 py-1 rounded-full mb-4">
                  {cause.category}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{cause.title}</h1>
                <p className="text-blue-100">
                  Created by {cause.createdBy?.nom} {cause.createdBy?.prenom}
                </p>
              </div>

              <div className="flex gap-2">
                <motion.button
                  className="p-2 bg-blue-800/50 hover:bg-blue-700/50 rounded-full"
                  onClick={() => handleShare("facebook")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook className="h-5 w-5" />
                </motion.button>
                <motion.button
                  className="p-2 bg-blue-800/50 hover:bg-blue-700/50 rounded-full"
                  onClick={() => handleShare("twitter")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter className="h-5 w-5" />
                </motion.button>
                <motion.button
                  className="p-2 bg-blue-800/50 hover:bg-blue-700/50 rounded-full"
                  onClick={() => handleShare("linkedin")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.button>
                <motion.button
                  className="p-2 bg-blue-800/50 hover:bg-blue-700/50 rounded-full"
                  onClick={handleCopyLink}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                </motion.button>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-blue-100 whitespace-pre-line">{cause.description}</p>
            </div>

            {/* Display URL if available */}
            {cause.url && (
              <div className="bg-blue-900/30 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">External Link</h3>
                <a
                  href={cause.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-100 underline break-all"
                >
                  {cause.url}
                </a>
              </div>
            )}

            <div className="bg-blue-900/30 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-100">Progress</span>
                <span className="text-blue-100">{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-blue-900/50 mb-4" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-200">Raised</p>
                  <p className="text-2xl font-bold text-white">${cause.currentAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-200">Goal</p>
                  <p className="text-2xl font-bold text-white">${cause.targetAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <motion.button
              className="w-full py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Donate Now
            </motion.button>
          </div>
        </motion.div>

        <div className="flex justify-between mb-16">
          <Link to="/causes">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-500/30 text-blue-100 hover:bg-blue-800/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Causes
            </Button>
          </Link>

          <Button
            className="flex items-center gap-2"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: cause.title,
                    text: `Check out this cause: ${cause.title}`,
                    url: window.location.href,
                  })
                  .catch((err) => console.error("Error sharing:", err))
              } else {
                handleCopyLink()
              }
            }}
          >
            <Share2 className="h-4 w-4" />
            Share This Cause
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CauseShare

