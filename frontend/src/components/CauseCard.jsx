"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Share2, Target, DollarSign, Copy } from "lucide-react"
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
  RIB,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState("")
  const navigate = useNavigate()

  const getShareUrl = () => {
    if (shareUrl) return shareUrl;
    return `${title.toLowerCase().replace(/\s+/g, '-')}-${id}`;
  };

  const handleClick = () => {
    navigate(`/cause/share/${getShareUrl()}`);
  };

  useEffect(() => {
    setImageSrc(image || "https://placehold.co/600x400/1e3a8a/ffffff?text=No+Image")
  }, [image])

  const handleImageError = () => {
    setImageSrc("https://placehold.co/600x400/1e3a8a/ffffff?text=Image+Not+Available")
  }

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
      }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent" />
        
        {/* Category Tag */}
        {category && (
          <span className="absolute top-4 left-4 bg-blue-500/80 backdrop-blur-sm px-3 py-1 
                         rounded-full text-xs font-medium text-white border border-blue-400/30">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-semibold text-white line-clamp-1 group-hover:text-blue-300 
                     transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-blue-200/80 line-clamp-2">
            {description}
          </p>
        )}

        {/* Progress Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span>Raised: ${(raised || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Goal: ${(goal || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative pt-2">
            <Progress 
              value={progress || 0} 
              className="h-2 bg-blue-950/50" 
            />
            <span className="absolute right-0 -top-1 text-xs text-blue-300">
              {(progress || 0).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* RIB Information */}
        {RIB && (
          <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-200">RIB:</span>
              <div className="flex items-center gap-2">
                <code className="text-sm text-blue-300 font-mono">{RIB}</code>
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(RIB);
                    toast.success("RIB copied to clipboard!");
                  }}
                  className="p-1 hover:bg-blue-800/50 rounded-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Copy className="w-4 h-4 text-blue-400" />
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Donate Button */}
        <motion.button
          onClick={() => navigate(`/causes/share/${shareUrl || id}`)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 
                   text-white py-3 px-4 rounded-lg font-medium 
                   shadow-lg shadow-blue-500/20 
                   flex items-center justify-center gap-2 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Donate Now</span>
          <Share2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CauseCard

