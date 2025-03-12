"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Check } from "lucide-react"
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

  useEffect(() => {
    const fetchCause = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5001/api/causes/share/${shareUrl}`)

        if (!response.ok) {
          throw new Error("Failed to fetch cause")
        }

        const data = await response.json()
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
          {cause.image && (
            <div className="w-full h-64 md:h-96 bg-blue-900/20">
              <img
                src={cause.image.startsWith("http") ? cause.image : `http://localhost:5001/${cause.image}`}
                alt={cause.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Found"
                }}
              />
            </div>
          )}

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

