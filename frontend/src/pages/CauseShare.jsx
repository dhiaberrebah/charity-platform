"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Check, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../context/AuthContext"
import NavigationBar from "../components/NavigationBar"
import UserNavigationBar from "../components/UserNavigationBar"
import AdminNavbar from "../components/AdminNavbar"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import DonationModal from "@/components/DonationModal"
import DonationList from "@/components/DonationList"
import { useCauseProgress } from '@/hooks/useCauseProgress';

// Define the API base URL
const API_BASE_URL = "http://localhost:5001"

const CauseShare = () => {
  const { shareUrl } = useParams();
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  
  const openDonationModal = () => {
    setIsDonationModalOpen(true);
  };

  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
  };

  const handleImageError = () => {
    setImageError(true);
    console.log("Image load error occurred");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  // Add getImageUrl function
  const getImageUrl = (image) => {
    // If the image is a full URL (like from Cloudinary), use it directly
    if (image && (image.startsWith("http://") || image.startsWith("https://"))) {
      return image;
    }

    // If it's a relative path (like from local uploads), prepend the server URL
    if (image) {
      return `${API_BASE_URL}/${image}`;
    }

    // Fallback image
    return "https://placehold.co/600x400/1e3a8a/ffffff?text=No+Image";
  };

  // Always call hooks at the top level, before any conditional logic
  const { isAuthenticated, isAdmin } = useAuth();
  const { data: progressData } = useCauseProgress(cause?._id);

  let NavbarComponent = NavigationBar;
  if (isAdmin) {
    NavbarComponent = AdminNavbar;
  } else if (isAuthenticated) {
    NavbarComponent = UserNavigationBar;
  }

  useEffect(() => {
    const fetchCause = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/causes/public/${shareUrl}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch cause: ${response.status}`);
        }
        const data = await response.json();
        setCause(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching cause:", error);
        setError("This cause is not available or has been removed.");
      } finally {
        setLoading(false);
      }
    };

    if (shareUrl) {
      fetchCause();
    }
  }, [shareUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-fixed bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <NavbarComponent />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-blue-500/20">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cause) {
    return (
      <div className="min-h-screen bg-fixed bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <NavbarComponent />
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
    );
  }

  // Calculate progress values after all hooks and conditionals
  const currentProgress = progressData ? 
    (progressData.currentAmount / progressData.targetAmount) * 100 : 
    (cause.currentAmount / cause.targetAmount) * 100;

  const currentAmount = progressData?.currentAmount || cause.currentAmount;
  const imageUrl = cause.image ? getImageUrl(cause.image) : null;

  return (
    <div className="min-h-screen bg-fixed bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
      <div className="relative">
        <NavbarComponent />
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

              {cause.RIB && (
                <div className="mb-8 bg-blue-900/30 p-6 rounded-xl border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Banking Information</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">RIB:</span>
                      <div className="flex items-center gap-3">
                        <code className="text-blue-300 font-mono bg-blue-900/40 px-3 py-1 rounded">{cause.RIB}</code>
                        <motion.button
                          className="p-2 bg-blue-800/50 hover:bg-blue-700/50 rounded-full"
                          onClick={() => {
                            navigator.clipboard.writeText(cause.RIB);
                            toast.success("RIB copied to clipboard!");
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Copy className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-sm text-blue-200/70 mt-2">
                      Use this RIB to make a direct bank transfer to support this cause.
                    </p>
                  </div>
                </div>
              )}

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
                  <span className="text-blue-100">{currentProgress.toFixed(1)}%</span>
                </div>
                <Progress value={currentProgress} className="h-3 bg-blue-900/50 mb-4" />
                <div className="flex justify-between text-sm text-blue-200">
                  <span>${currentAmount.toLocaleString()} raised</span>
                  <span>Goal: ${cause.targetAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-8">
                {cause._id && (
                  <>
                    {console.log("Passing causeId to DonationList:", cause._id)}
                    <DonationList causeId={cause._id} />
                  </>
                )}
              </div>

              <motion.button
                className="w-full py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openDonationModal}
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

      <AnimatePresence>
        {isDonationModalOpen && <DonationModal cause={cause} onClose={closeDonationModal} />}
      </AnimatePresence>
    </div>
  )
}

export default CauseShare

