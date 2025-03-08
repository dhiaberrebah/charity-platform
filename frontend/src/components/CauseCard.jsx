"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

const CauseCard = ({ id, title, description, image, raised, goal, category }) => {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState("")
  const progress = Math.min((raised / goal) * 100, 100)

  // Process the image URL when component mounts or image changes
  useEffect(() => {
    if (!image) {
      setImageSrc("https://placehold.co/600x400/e2e8f0/64748b?text=No+Image")
      return
    }

    // Fix common URL issues
    let processedUrl = image

    // Check if it's a file system path with double slashes
    if (processedUrl.includes("//Users/") || processedUrl.includes("//home/")) {
      // Extract just the filename from the path
      const filename = processedUrl.split("/").pop()
      // Construct a proper URL to the backend uploads folder
      processedUrl = `http://localhost:5001/uploads/${filename}`
    }

    // Remove any double slashes (except after http:)
    processedUrl = processedUrl.replace(/(https?:\/\/)|(\/\/)/g, (match) => {
      return match === "http://" || match === "https://" ? match : "/"
    })

    setImageSrc(processedUrl)
  }, [image])

  // Handle image loading errors
  const handleImageError = () => {
    console.error(`Image failed to load for cause "${title}":`, image)
    console.log("Processed URL was:", imageSrc)
    setImageError(true)
  }

  // Determine the final image source with fallback
  const finalImageSrc = imageError ? "https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Found" : imageSrc

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="aspect-[4/3] relative bg-gray-100">
        <img
          src={finalImageSrc || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {category && (
          <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            {category}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 mb-6 line-clamp-2">{description}</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-gray-100" />
            <div className="flex justify-between items-center text-sm">
              <div className="space-y-1">
                <p className="text-gray-600">Raised</p>
                <p className="font-medium">${raised.toLocaleString()}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-gray-600">Goal</p>
                <p className="font-medium">${goal.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <button
            className="w-full py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium"
            onClick={() => console.log(`Donate clicked for cause: ${id}`)}
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default CauseCard

