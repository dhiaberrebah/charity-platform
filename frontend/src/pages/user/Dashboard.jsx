"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Heart,
  FileText,
  CreditCard,
  HandHeart,
  LockKeyhole,
  UserCircle,
  Camera,
  Phone,
  Mail,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  Eye,
  X,
  Bell,
  LogOut,
  Settings,
  Shield,
  ShieldOff,
  Clock,
  FileCheck,
  CheckCircle,
  Lock,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import MyCauses from "@/components/MyCauses"
import NavigationBar from "@/components/UserNavigationBar"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"

const API_BASE_URL = "http://localhost:5001"; // Adjust this to match your backend URL

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState('pending')

  // Create a function to refresh user info
  const refreshUserInfo = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5001/api/auth/check", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }
      const data = await response.json()
      console.log("Refreshed user data:", data)
      setUserInfo(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUserInfo()
  }, [refreshUserInfo])

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verification-status`, {
          credentials: 'include',
        })
        const data = await response.json()
        console.log('Initial verification check:', data) // Add this to debug
        setVerificationStatus(data.status)
      } catch (error) {
        console.error('Error checking verification status:', error)
        setVerificationStatus('pending')
      }
    }

    checkVerificationStatus()
  }, [])

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-causes", label: "My Causes", icon: Heart },
    { id: "my-info", label: "My Information", icon: UserCircle },
    { id: "documents", label: "My Documents", icon: FileText },
    { id: "participations", label: "My Participations", icon: HandHeart },
    { id: "password", label: "Password", icon: LockKeyhole },
  ]

  const handleInputChange = (e, updatedUser = null) => {
    if (updatedUser) {
      setUserInfo(updatedUser)
    } else {
      const { name, value } = e.target
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [name]: name === "age" ? Number.parseInt(value, 10) : value,
      }))
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64 bg-blue-800/20 rounded-xl border border-blue-500/20 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-500/10 text-red-200 border border-red-500/20 p-6 rounded-xl shadow-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )
    }

    switch (activeSection) {
      case "my-info":
        return (
          <UserInformation
            userInfo={userInfo}
            onChange={handleInputChange}
            refreshUserInfo={refreshUserInfo}
            setActiveSection={setActiveSection}
          />
        )
      case "documents":
        return <DocumentUpload />
      case "participations":
        return <Participations navigate={navigate} />
      case "password":
        return <PasswordChange />
      case "my-causes":
        return <MyCauses />
      case "dashboard":
      default:
        return <DashboardOverview 
          userInfo={userInfo} 
          setActiveSection={setActiveSection} 
          verificationStatus={verificationStatus}
        />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      {/* Navigation Bar */}
      <NavigationBar />

      <div className="flex pt-16">
        {/* Left Sidebar - professional design */}
        <aside className="fixed top-16 left-0 w-72 bg-blue-950/80 backdrop-blur-xl border-r border-blue-500/20 shadow-xl z-10 h-[calc(100vh-4rem)] overflow-y-auto">
          {/* User profile section */}
          <div className="p-6 border-b border-blue-700/30 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                {userInfo?.prenom ? (
                  <span className="text-white font-semibold text-lg">{userInfo.prenom.charAt(0)}</span>
                ) : (
                  <UserCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-white text-lg">
                  {userInfo?.prenom ? `${userInfo.prenom} ${userInfo.nom || ""}` : "Welcome"}
                </h3>
                <p className="text-xs text-blue-300">{userInfo?.email || "User"}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-300 hover:text-white hover:bg-blue-800/30"
                onClick={() => navigate("/user/notifications")}
              >
                <Bell size={16} className="mr-1" />
                <span className="text-xs">Notifications</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-blue-300 hover:text-white hover:bg-blue-800/30"
                onClick={() => navigate("/settings")}
              >
                <Settings size={16} className="mr-1" />
                <span className="text-xs">Settings</span>
              </Button>
            </div>
          </div>

          {/* Navigation menu */}
          <div className="py-4">
            <div className="px-6 py-2">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Main Menu</h3>
            </div>
            <nav className="mt-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-6 py-3 transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-800/60 to-transparent text-white border-l-4 border-blue-500"
                      : "text-blue-300 hover:bg-blue-800/30 hover:text-white"
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon
                    size={18}
                    className={`mr-3 ${activeSection === item.id ? "text-blue-400" : "text-blue-400"}`}
                  />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Logout button */}
          <div className="fixed bottom-0 left-0 w-72 p-6 border-t border-blue-700/30 bg-blue-950/80">
            <Button
              variant="outline"
              className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-800/30 hover:text-white flex items-center justify-center"
              onClick={() => navigate("/")}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 pb-24 overflow-y-auto h-[calc(100vh-4rem)] ml-72">
          <div className="max-w-5xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "my-causes" && "My Causes"}
                {activeSection === "my-info" && "My Information"}
                {activeSection === "documents" && "My Documents"}
                {activeSection === "participations" && "My Participations"}
                {activeSection === "password" && "Password Settings"}
              </h1>
              <p className="text-blue-300 mt-2">
                {activeSection === "dashboard" && "Welcome back to your dashboard"}
                {activeSection === "my-causes" && "Manage your causes and donations"}
                {activeSection === "my-info" && "Update your personal information"}
                {activeSection === "documents" && "Upload and manage your documents"}
                {activeSection === "participations" && "View your participation history"}
                {activeSection === "password" && "Manage your account security"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

const UserInformation = ({ userInfo, onChange, refreshUserInfo, setActiveSection }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [originalUserInfo, setOriginalUserInfo] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Store the original user info when the component mounts or when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setOriginalUserInfo({ ...userInfo })
    }
  }, [])

  // Check if the current userInfo is different from the original
  useEffect(() => {
    if (originalUserInfo && userInfo) {
      const fieldsToCompare = ["nom", "prenom", "age", "adresse", "telephone", "email"]

      const changed = fieldsToCompare.some((field) => {
        // Handle special case for age (could be string or number)
        if (field === "age") {
          return Number(originalUserInfo[field]) !== Number(userInfo[field])
        }
        return originalUserInfo[field] !== userInfo[field]
      })

      setHasChanges(changed)
    }
  }, [userInfo, originalUserInfo])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    onChange({
      target: {
        name,
        value: name === "age" ? (value === "" ? "" : Number.parseInt(value, 10)) : value,
      },
    })
  }

  const resetForm = () => {
    if (originalUserInfo) {
      onChange(null, { ...originalUserInfo })
      setSaveSuccess(false)
      setSaveError(null)
    }
  }

  const handleSaveChanges = async (e) => {
    e.preventDefault()

    if (!userInfo || !userInfo._id) {
      setSaveError("User information is missing. Please refresh the page and try again.")
      return
    }

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      // Use the correct endpoint with the user ID
      const response = await fetch(`http://localhost:5001/api/auth/users/${userInfo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userInfo),
      })

      if (!response.ok) {
        throw new Error(`Failed to save changes: ${response.statusText}`)
      }

      const data = await response.json()

      // Refresh user info to get the latest data
      await refreshUserInfo()

      // Update the original user info to the new values
      setOriginalUserInfo({ ...userInfo })
      setHasChanges(false)
      setSaveSuccess(true)

      // Navigate back to dashboard after successful save
      setTimeout(() => {
        setActiveSection("dashboard")
      }, 1500) // Short delay to show success message before redirecting
    } catch (error) {
      console.error("Profile update error:", error)
      setSaveError(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSaveChanges} className="space-y-8">
      

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="prenom" className="text-slate-300 text-sm font-medium">
                First Name
              </Label>
              <Input
                id="prenom"
                name="prenom"
                value={userInfo?.prenom || ""}
                onChange={handleInputChange}
                autoComplete="given-name"
                className="mt-1 bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="nom" className="text-slate-300 text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="nom"
                name="nom"
                value={userInfo?.nom || ""}
                onChange={handleInputChange}
                autoComplete="family-name"
                className="mt-1 bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                value={userInfo?.email || ""}
                onChange={handleInputChange}
                autoComplete="email"
                className="mt-1 bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="age" className="text-slate-300 text-sm font-medium">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={userInfo?.age || ""}
                onChange={handleInputChange}
                autoComplete="age"
                className="mt-1 bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="telephone" className="text-slate-300 text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="telephone"
                name="telephone"
                value={userInfo?.telephone || ""}
                onChange={handleInputChange}
                autoComplete="tel"
                className="mt-1 bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="adresse" className="text-slate-300 text-sm font-medium">
                Address
              </Label>
              <Input
                id="adresse"
                name="adresse"
                value={userInfo?.adresse || ""}
                onChange={handleInputChange}
                autoComplete="street-address"
                className="mt-1 bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex gap-3 justify-end">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                className="border-blue-500/30 text-blue-300 hover:bg-blue-800/30 hover:text-white"
                onClick={resetForm}
                disabled={!hasChanges}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white"
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </div>

          {!hasChanges && !saveSuccess && !saveError && (
            <p className="text-sm text-slate-400 text-center mt-4">Make changes to enable saving</p>
          )}

          {saveError && (
            <motion.div
              className="bg-red-500/10 text-red-200 border border-red-500/20 p-4 mt-4 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-medium">Error:</p>
              <p>{saveError}</p>
              <p className="text-sm mt-2">If this problem persists, please contact support or try again later.</p>
            </motion.div>
          )}

          {saveSuccess && (
            <motion.div
              className="bg-green-500/10 text-green-200 border border-green-500/20 p-4 mt-4 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-medium">Success!</p>
              <p>Your information has been updated successfully.</p>
            </motion.div>
          )}
        </div>
      </form>
    </motion.div>
  )
}

const DocumentUpload = () => {
  const [frontDocument, setFrontDocument] = useState(null)
  const [backDocument, setBackDocument] = useState(null)
  const [frontPreview, setFrontPreview] = useState(null)
  const [backPreview, setBackPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({ success: false, message: "" })
  const [verificationStatus, setVerificationStatus] = useState("pending")
  const frontInputRef = useRef(null)
  const backInputRef = useRef(null)

  // Fetch user's verification status on component mount
  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      // Changed from "http://localhost:5001/api/auth/verification-status"
      const response = await fetch(`${API_BASE_URL}/api/auth/verification-status`, {
        credentials: "include",
      })
      const data = await response.json()
      console.log('API Response:', data) // Add this to debug
      setVerificationStatus(data.status)
      
      // If documents exist, set their previews
      if (data.documents) {
        setFrontPreview(data.documents.front)
        setBackPreview(data.documents.back)
      }
    } catch (error) {
      console.error("Error fetching verification status:", error)
    }
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG or PDF file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB")
      return
    }

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === "front") {
          setFrontPreview(e.target.result)
          setFrontDocument(file)
        } else {
          setBackPreview(e.target.result)
          setBackDocument(file)
        }
      }
      reader.readAsDataURL(file)
    } else {
      // For PDFs, just store the file without preview
      if (type === "front") {
        setFrontDocument(file)
        setFrontPreview("/placeholder.svg")
      } else {
        setBackDocument(file)
        setBackPreview("/placeholder.svg")
      }
    }
  }

  const handleUpload = async () => {
    if (!frontDocument && !backDocument) {
      alert("Please upload at least one document");
      return;
    }

    setUploading(true);
    setUploadStatus({ success: false, message: "" });

    try {
      const formData = new FormData();
      if (frontDocument) formData.append("frontDocument", frontDocument);
      if (backDocument) formData.append("backDocument", backDocument);

      const response = await fetch("http://localhost:5001/api/documents/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload documents");
      }

      const data = await response.json();
      setVerificationStatus("pending");
      setUploadStatus({
        success: true,
        message: "Documents uploaded successfully and pending verification",
      });

      // Clear the form
      setFrontDocument(null);
      setBackDocument(null);
      setFrontPreview(null);
      setBackPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        success: false,
        message: error.message || "Error uploading documents",
      });
    } finally {
      setUploading(false);
    }
  }

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <div className="flex items-center space-x-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-lg">
            <Shield size={20} />
            <span>Verified Account</span>
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center space-x-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg">
            <ShieldOff size={20} />
            <span>Verification Rejected</span>
          </div>
        )
      case "pending":
        return (
          <div className="flex items-center space-x-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-lg">
            <Clock size={20} />
            <span>Verification Pending</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Identity Verification</h3>
          {getStatusBadge()}
        </div>
        <p className="text-blue-300">Please upload your identification documents for verification purposes.</p>
      </div>

      {verificationStatus === "rejected" && (
        <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-300">Your verification was rejected. Please upload new documents.</p>
        </div>
      )}

      <div className="bg-blue-900/30 p-6 rounded-xl mb-8 border border-blue-500/20">
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Front Document Upload */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-3 text-slate-300">Front side of ID</p>
            <motion.div
              className={`border-2 border-dashed ${
                frontPreview ? "border-purple-500/50" : "border-white/20"
              } rounded-xl p-6 text-center relative overflow-hidden cursor-pointer bg-blue-900/30 hover:bg-blue-800/30 transition-colors`}
              onClick={() => frontInputRef.current.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {frontPreview ? (
                <>
                  <img
                    src={frontPreview}
                    alt="ID Front Preview"
                    className="mx-auto max-h-40 object-contain mb-3"
                  />
                  <p className="text-sm text-slate-300">
                    {frontDocument ? frontDocument.name : "Uploaded document"}
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    className="mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Camera className="w-12 h-12 mx-auto text-slate-400" />
                  </motion.div>
                  <p className="text-sm text-slate-300 mb-2">Upload front side</p>
                  <p className="text-xs text-slate-400">JPG, PNG or PDF accepted</p>
                </>
              )}
              <input
                type="file"
                ref={frontInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange(e, "front")}
              />
            </motion.div>
          </div>

          {/* Back Document Upload */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-3 text-slate-300">Back side of ID</p>
            <motion.div
              className={`border-2 border-dashed ${
                backPreview ? "border-purple-500/50" : "border-white/20"
              } rounded-xl p-6 text-center relative overflow-hidden cursor-pointer bg-blue-900/30 hover:bg-blue-800/30 transition-colors`}
              onClick={() => backInputRef.current.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {backPreview ? (
                <>
                  <img
                    src={backPreview}
                    alt="ID Back Preview"
                    className="mx-auto max-h-40 object-contain mb-3"
                  />
                  <p className="text-sm text-slate-300">
                    {backDocument ? backDocument.name : "Uploaded document"}
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    className="mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Camera className="w-12 h-12 mx-auto text-slate-400" />
                  </motion.div>
                  <p className="text-sm text-slate-300 mb-2">Upload back side</p>
                  <p className="text-xs text-slate-400">JPG, PNG or PDF accepted</p>
                </>
              )}
              <input
                type="file"
                ref={backInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange(e, "back")}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Upload button and status message */}
      <div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-xl"
            onClick={handleUpload}
            disabled={uploading || (!frontDocument && !backDocument) || verificationStatus === "verified"}
          >
            {uploading ? (
              "Uploading..."
            ) : verificationStatus === "verified" ? (
              "Already Verified"
            ) : (
              "Submit Documents for Verification"
            )}
          </Button>
        </motion.div>

        {uploadStatus.message && (
          <motion.div
            className={`mt-6 p-4 rounded-lg ${
              uploadStatus.success
                ? "bg-green-500/10 text-green-200 border border-green-500/20"
                : "bg-red-500/10 text-red-200 border border-red-500/20"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {uploadStatus.message}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

const BankDetails = ({ userInfo, onChange }) => (
  <motion.div
    className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-6 text-white">Bank Details</h2>
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="bankHolder" className="text-slate-300 text-sm font-medium">
          Account Holder Name
        </Label>
        <Input
          id="bankHolder"
          name="bankHolder"
          value={userInfo?.bankHolder || ""}
          onChange={onChange}
          autoComplete="name"
          className="bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bankName" className="text-slate-300 text-sm font-medium">
          Bank Name
        </Label>
        <Input
          id="bankName"
          name="bankName"
          value={userInfo?.bankName || ""}
          onChange={onChange}
          autoComplete="organization"
          className="bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="branchName" className="text-slate-300 text-sm font-medium">
          Branch Name
        </Label>
        <Input
          id="branchName"
          name="branchName"
          value={userInfo?.branchName || ""}
          onChange={onChange}
          autoComplete="off"
          className="bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rib" className="text-slate-300 text-sm font-medium">
          RIB
        </Label>
        <Input
          id="rib"
          name="rib"
          value={userInfo?.rib || ""}
          onChange={onChange}
          autoComplete="off"
          className="bg-blue-900/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          className="text-purple-500 border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
        />
        <label htmlFor="terms" className="text-sm text-slate-300">
          I certify that I am the holder of this bank/postal account
        </label>
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">Save Changes</Button>
      </motion.div>
    </div>
  </motion.div>
)

const Donations = () => (
  <motion.div
    className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-6 text-white">My Donations</h2>
    <motion.div
      className="text-center py-16"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <CreditCard className="w-16 h-16 mx-auto text-purple-400 mb-4" />
      <p className="text-slate-300 text-lg">No donation requests found</p>
      <p className="text-slate-400 mt-2">Your donation history will appear here</p>
    </motion.div>
  </motion.div>
)

const Participations = ({ navigate }) => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDonation, setSelectedDonation] = useState(null)

  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        setLoading(true)
        // Fetch the user's donations from the API
        const response = await fetch("http://localhost:5001/api/donations/user", {
          credentials: "include", // Include cookies for authentication
        })

        if (!response.ok) {
          throw new Error("Failed to fetch donations")
        }

        const data = await response.json()
        setDonations(data)
      } catch (err) {
        console.error("Error fetching donations:", err)
        setError(err.message || "Failed to load donations")
      } finally {
        setLoading(false)
      }
    }

    fetchUserDonations()
  }, [])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Handle click on a donation to navigate to the cause page
  const handleDonationClick = (donation) => {
    if (donation.cause && donation.cause._id) {
      // Navigate to the specific cause detail page
      navigate(`/cause/${donation.cause._id}`)
    } else {
      console.error("Cannot navigate: Missing cause ID", donation)
    }
  }

  // Handle view details
  const handleViewDetails = (donation) => {
    setSelectedDonation(donation)
  }

  // Handle close details modal
  const handleCloseDetails = () => {
    setSelectedDonation(null)
  }

  return (
    <motion.div
      className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <motion.div
          className="bg-red-500/10 text-red-200 border border-red-500/20 p-6 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-medium">Error loading donations:</p>
          <p>{error}</p>
        </motion.div>
      ) : donations.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <HandHeart className="w-16 h-16 mx-auto text-purple-400 mb-4" />
          <p className="text-slate-300 text-lg">No participations found</p>
          <p className="text-slate-400 mt-2">Your participation history will appear here</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <motion.div
              key={donation._id}
              className="bg-blue-900/30 rounded-lg p-6 border border-blue-500/20 hover:bg-blue-800/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-white text-lg">{donation.cause?.title || "Unknown Cause"}</h3>
                    <ExternalLink
                      className="w-4 h-4 ml-2 text-purple-400 cursor-pointer"
                      onClick={() => handleDonationClick(donation)}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Donation ID: {donation.transactionId}</p>
                  <p className="text-sm text-slate-400">Date: {formatDate(donation.createdAt)}</p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="text-xl font-bold text-white">{formatCurrency(donation.amount)}</p>
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full mt-2 ${
                      donation.status === "completed"
                        ? "bg-green-500/20 text-green-300"
                        : donation.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </span>
                </div>
              </div>
              {donation.message && (
                <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-slate-300 italic">"{donation.message}"</p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <motion.button
                  className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600 rounded-lg flex items-center transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewDetails(donation)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye size={16} className="text-white mr-2" />
                  <span className="text-sm text-white">View Details</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-blue-900/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-blue-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-500/20"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-blue-700/30 bg-gradient-to-r from-blue-900/40 to-blue-800/40">
              <h2 className="text-2xl font-bold text-white">Donation Details</h2>
              <button onClick={handleCloseDetails} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Donation Information</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400">Donation ID</p>
                      <p className="text-white font-mono text-sm">{selectedDonation._id}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Amount</p>
                      <p className="text-white font-bold text-xl">{formatCurrency(selectedDonation.amount)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Date & Time</p>
                      <p className="text-white">
                        {new Date(selectedDonation.createdAt).toLocaleDateString()} at{" "}
                        {new Date(selectedDonation.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Status</p>
                      <p
                        className={`font-medium ${
                          selectedDonation.status === "completed"
                            ? "text-green-400"
                            : selectedDonation.status === "pending"
                              ? "text-yellow-400"
                              : selectedDonation.status === "failed"
                                ? "text-red-400"
                                : "text-slate-400"
                        }`}
                      >
                        {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                      </p>
                    </div>

                    {selectedDonation.transactionId && (
                      <div>
                        <p className="text-sm text-slate-400">Transaction ID</p>
                        <p className="text-white font-mono text-sm">{selectedDonation.transactionId}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-slate-400">Payment Method</p>
                      <p className="text-white capitalize">{selectedDonation.paymentMethod || "Card"}</p>
                    </div>

                    {selectedDonation.paymentDetails && (
                      <div>
                        <p className="text-sm text-slate-400">Card Details</p>
                        <p className="text-white">
                          {selectedDonation.paymentDetails.cardName || "N/A"} ••••
                          {selectedDonation.paymentDetails.last4 || "****"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Donor Information</h3>

                  <div className="space-y-4">
                    {selectedDonation.isAnonymous ? (
                      <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/20">
                        <p className="text-white italic">This donation was made anonymously</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm text-slate-400">Name</p>
                          <p className="text-white">
                            {selectedDonation.donor?.firstName || ""} {selectedDonation.donor?.lastName || ""}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-slate-400">Email</p>
                          <p className="text-white">{selectedDonation.donor?.email || "N/A"}</p>
                        </div>

                        {selectedDonation.donor?.phone && (
                          <div>
                            <p className="text-sm text-slate-400">Phone</p>
                            <p className="text-white">{selectedDonation.donor.phone}</p>
                          </div>
                        )}

                        {selectedDonation.donor?.address && (
                          <div>
                            <p className="text-sm text-slate-400">Address</p>
                            <p className="text-white">
                              {selectedDonation.donor.address}
                              {selectedDonation.donor.city && `, ${selectedDonation.donor.city}`}
                              {selectedDonation.donor.country && `, ${selectedDonation.donor.country}`}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {selectedDonation.message && (
                      <div className="mt-4">
                        <p className="text-sm text-slate-400">Message</p>
                        <div className="bg-blue-900/30 p-4 rounded-lg mt-1 border border-blue-500/20">
                          <p className="text-white italic">"{selectedDonation.message}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-blue-700/30 flex justify-between">
                <Button
                  onClick={() => {
                    handleCloseDetails()
                    if (selectedDonation.cause && selectedDonation.cause._id) {
                      navigate(`/cause/${selectedDonation.cause._id}`)
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                >
                  View Cause
                </Button>
                <Button
                  onClick={handleCloseDetails}
                  variant="outline"
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-800/30 hover:text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

const PasswordChange = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user starts typing
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match")
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password")
      }

      // Clear form and show success message
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message || "An error occurred while changing the password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">Change Password</h3>
        <p className="text-blue-300">Update your password to keep your account secure.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="currentPassword" className="text-slate-300">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="mt-1 bg-blue-900/30 border-blue-500/30 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="newPassword" className="text-slate-300">
            New Password
          </Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className="mt-1 bg-blue-900/30 border-blue-500/30 text-white"
            required
          />
          <p className="text-xs text-slate-400 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-slate-300">
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 bg-blue-900/30 border-blue-500/30 text-white"
            required
          />
        </div>

        {error && (
          <motion.div
            className="bg-red-500/10 text-red-200 border border-red-500/20 p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            className="bg-green-500/10 text-green-200 border border-green-500/20 p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Password changed successfully!
          </motion.div>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Changing Password...
            </div>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </motion.div>
  )
}

const DashboardOverview = ({ userInfo, setActiveSection, verificationStatus }) => {
  const navigate = useNavigate()

  return (
    <div className="grid gap-8">
      {verificationStatus !== 'verified' && (
        <motion.div
          className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Account Verification Required</h2>
              <p className="text-blue-300 mt-2">
                To ensure platform security and comply with regulations, we need to verify your identity.
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-lg">
              <Clock size={20} />
              <span>Verification Needed</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Required Documents</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <FileCheck size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Front of ID Document</p>
                    <p className="text-sm text-blue-300">Upload a clear photo of your government-issued ID (passport, driver's license, or national ID)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <FileCheck size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Back of ID Document</p>
                    <p className="text-sm text-blue-300">Upload a clear photo of the back side of your ID</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/20">
              <h3 className="text-lg font-semibold text-white mb-2">Why verify your account?</h3>
              <ul className="space-y-2 text-blue-300">
                <li className="flex items-center space-x-2">
                  <Shield size={16} />
                  <span>Ensure platform security and trust</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span>Access all platform features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Lock size={16} />
                  <span>Protect against fraud</span>
                </li>
              </ul>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 text-lg font-semibold"
                onClick={() => setActiveSection("documents")}
              >
                Start Verification Process
              </Button>
            </motion.div>
            
            <p className="text-sm text-center text-blue-300">
              Verification usually takes 1-2 business days after document submission
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Personal Information section - unchanged */}
          <h2 className="text-xl font-bold mb-6 text-white">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-blue-700/30 pb-3">
              <p className="text-slate-400">Name</p>
              <p className="text-white font-medium">
                {userInfo?.prenom || "Not set"} {userInfo?.nom || ""}
              </p>
            </div>

            <div className="flex justify-between border-b border-blue-700/30 pb-3">
              <p className="text-slate-400">Email</p>
              <p className="text-white font-medium">{userInfo?.email || "Not set"}</p>
            </div>

            <div className="flex justify-between border-b border-blue-700/30 pb-3">
              <p className="text-slate-400">Phone</p>
              <p className="text-white font-medium">{userInfo?.telephone || "Not set"}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-slate-400">Address</p>
              <p className="text-white font-medium">{userInfo?.adresse || "Not set"}</p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
              <Button
                onClick={() => setActiveSection("my-info")}
                variant="outline"
                className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-800/30 hover:text-white"
              >
                Edit Information
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Account Security section - unchanged */}
          <h2 className="text-xl font-bold mb-6 text-white">Account Security</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-blue-700/30 pb-3">
              <p className="text-slate-400">Password</p>
              <p className="text-white font-medium">••••••••</p>
            </div>

            <div className="flex justify-between border-b border-blue-700/30 pb-3">
              <p className="text-slate-400">Two-Factor Authentication</p>
              <p className="text-red-400 font-medium">Not Enabled</p>
            </div>

            <div className="flex justify-between">
              <p className="text-slate-400">Connected Accounts</p>
              <div className="flex space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <span className="text-xs text-slate-300">f</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <span className="text-xs text-slate-300">g</span>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
              <Button
                onClick={() => setActiveSection("password")}
                variant="outline"
                className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-800/30 hover:text-white"
              >
                Manage Security
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
