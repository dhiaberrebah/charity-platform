"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

const CauseCard = ({ 
  image, 
  title, 
  category, 
  description, 
  progress, 
  raised, 
  goal, 
  shareUrl, 
  id, 
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState("")
  const [hasImageError, setHasImageError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!image) {
      setImageSrc("https://placehold.co/600x400/e2e8f0/64748b?text=No+Image")
      return
    }
    setImageSrc(image)
  }, [image])

  // Handle image loading errors
  const handleImageError = () => {
    console.error(`Image failed to load for cause "${title}":`, image)
    console.log("Processed URL was:", imageSrc)
    setHasImageError(true)
    // Set a fallback image
    setImageSrc("https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Available")
  }

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-blue-500/20"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
    >
      <div className="aspect-[4/3] relative bg-blue-900/20">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {category && (
          <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            {category}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{title}</h3>
        <p className="text-blue-100 mb-6 line-clamp-2">{description || 'No description available'}</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Progress value={progress || 0} className="h-2 bg-blue-900/30" />
            <div className="flex justify-between items-center text-sm">
              <div className="space-y-1">
                <p className="text-blue-200">Raised</p>
                <p className="font-medium text-white">${(raised || 0).toLocaleString()}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-blue-200">Goal</p>
                <p className="font-medium text-white">${(goal || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <motion.button
            className="w-full py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium"
            onClick={() => navigate(`/causes/share/${shareUrl || id}`)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Donate Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default CauseCard

