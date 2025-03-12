"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Heart,
  FileText,
  BanknoteIcon,
  CreditCard,
  HandHeart,
  LockKeyhole,
  UserCircle,
  Camera,
  Phone,
  Mail,
  HelpCircle,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import MyCauses from "@/components/MyCauses"
import NavigationBar from "@/components/UserNavigationBar"
import { motion, AnimatePresence } from "framer-motion"

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-causes", label: "My Causes", icon: Heart },
    { id: "my-info", label: "My Information", icon: UserCircle },
    { id: "documents", label: "My Documents", icon: FileText },
    { id: "bank-details", label: "Bank Details", icon: BanknoteIcon },
    { id: "donations", label: "My Donations", icon: CreditCard },
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
        <div className="flex justify-center items-center h-64 bg-blue-50/50 rounded-lg border border-blue-200">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-600">
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
      case "bank-details":
        return <BankDetails userInfo={userInfo} onChange={handleInputChange} />
      case "donations":
        return <Donations />
      case "participations":
        return <Participations />
      case "password":
        return <PasswordChange />
      case "my-causes":
        return <MyCauses />
      case "dashboard":
      default:
        return <DashboardOverview userInfo={userInfo} setActiveSection={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Left Sidebar - adjusted to account for navbar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-sm border-r border-blue-200 overflow-y-auto">
        <nav className="px-4 py-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeSection === item.id ? "bg-blue-500 text-white" : "text-blue-700 hover:bg-blue-100"
              }`}
              whileHover={{ x: activeSection === item.id ? 0 : 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Main Content - adjusted to account for navbar */}
      <main className="ml-64 pt-16 p-8">
        <div className="max-w-4xl mx-auto">
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
      className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-900">My Information</h2>
      <form onSubmit={handleSaveChanges} className="space-y-6">
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </motion.div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-blue-800">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={userInfo?.email || ""}
              onChange={handleInputChange}
              autoComplete="email"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nom" className="text-blue-800">
              Nom
            </Label>
            <Input
              id="nom"
              name="nom"
              value={userInfo?.nom || ""}
              onChange={handleInputChange}
              autoComplete="family-name"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prenom" className="text-blue-800">
              Prénom
            </Label>
            <Input
              id="prenom"
              name="prenom"
              value={userInfo?.prenom || ""}
              onChange={handleInputChange}
              autoComplete="given-name"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age" className="text-blue-800">
              Age
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={userInfo?.age || ""}
              onChange={handleInputChange}
              autoComplete="age"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adresse" className="text-blue-800">
              Adresse
            </Label>
            <Input
              id="adresse"
              name="adresse"
              value={userInfo?.adresse || ""}
              onChange={handleInputChange}
              autoComplete="street-address"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telephone" className="text-blue-800">
              Téléphone
            </Label>
            <Input
              id="telephone"
              name="telephone"
              value={userInfo?.telephone || ""}
              onChange={handleInputChange}
              autoComplete="tel"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                className="w-auto border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={resetForm}
                disabled={!hasChanges}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </motion.div>
          </div>
          {!hasChanges && !saveSuccess && !saveError && (
            <p className="text-sm text-blue-500 text-center">Make changes to enable saving</p>
          )}
          {saveError && (
            <motion.div
              className="p-3 mt-3 bg-red-50 border border-red-200 rounded-md text-red-600"
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
              className="p-3 mt-3 bg-green-50 border border-green-200 rounded-md text-green-600"
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
  const frontInputRef = useRef(null)
  const backInputRef = useRef(null)

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
        setFrontPreview("/placeholder.svg?height=100&width=150")
      } else {
        setBackDocument(file)
        setBackPreview("/placeholder.svg?height=100&width=150")
      }
    }
  }

  const handleUpload = async () => {
    if (!frontDocument && !backDocument) {
      alert("Please upload at least one document")
      return
    }

    setUploading(true)
    setUploadStatus({ success: false, message: "" })

    try {
      const formData = new FormData()

      if (frontDocument) {
        formData.append("frontDocument", frontDocument)
      }

      if (backDocument) {
        formData.append("backDocument", backDocument)
      }

      const response = await fetch("http://localhost:5001/api/documents/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload documents")
      }

      const data = await response.json()

      setUploadStatus({
        success: true,
        message: "Documents uploaded successfully and pending approval",
      })

      // Clear the form
      setFrontDocument(null)
      setBackDocument(null)
      setFrontPreview(null)
      setBackPreview(null)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus({
        success: false,
        message: error.message || "Error uploading documents",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-900">My Documents</h2>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2 text-blue-800">Identity Documents</h3>

        <div className="flex gap-4 flex-col md:flex-row">
          {/* Front Document */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-2 text-blue-700">Front side of ID</p>
            <motion.div
              className={`border-2 border-dashed ${frontPreview ? "border-blue-500" : "border-blue-300"} rounded-lg p-4 text-center relative overflow-hidden cursor-pointer`}
              onClick={() => frontInputRef.current.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {frontPreview ? (
                <>
                  <img
                    src={frontPreview || "/placeholder.svg"}
                    alt="ID Front Preview"
                    className="mx-auto max-h-32 object-contain mb-2"
                  />
                  <p className="text-sm text-blue-600">{frontDocument.name}</p>
                </>
              ) : (
                <>
                  <motion.div
                    className="mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Camera className="w-8 h-8 mx-auto text-blue-400" />
                  </motion.div>
                  <p className="text-sm text-blue-600 mb-2">Upload front side</p>
                  <p className="text-xs text-blue-500">JPG, PNG or PDF accepted</p>
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

          {/* Back Document */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-2 text-blue-700">Back side of ID</p>
            <motion.div
              className={`border-2 border-dashed ${backPreview ? "border-blue-500" : "border-blue-300"} rounded-lg p-4 text-center relative overflow-hidden cursor-pointer`}
              onClick={() => backInputRef.current.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {backPreview ? (
                <>
                  <img
                    src={backPreview || "/placeholder.svg"}
                    alt="ID Back Preview"
                    className="mx-auto max-h-32 object-contain mb-2"
                  />
                  <p className="text-sm text-blue-600">{backDocument.name}</p>
                </>
              ) : (
                <>
                  <motion.div
                    className="mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Camera className="w-8 h-8 mx-auto text-blue-400" />
                  </motion.div>
                  <p className="text-sm text-blue-600 mb-2">Upload back side</p>
                  <p className="text-xs text-blue-500">JPG, PNG or PDF accepted</p>
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
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleUpload}
            disabled={uploading || (!frontDocument && !backDocument)}
          >
            {uploading ? "Uploading..." : "Submit Documents"}
          </Button>
        </motion.div>

        {uploadStatus.message && (
          <motion.div
            className={`mt-4 p-3 rounded-md ${uploadStatus.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
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
    className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-6 text-blue-900">Bank Details</h2>
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="bankHolder" className="text-blue-800">
          Account Holder Name
        </Label>
        <Input
          id="bankHolder"
          name="bankHolder"
          value={userInfo?.bankHolder || ""}
          onChange={onChange}
          autoComplete="name"
          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bankName" className="text-blue-800">
          Bank Name
        </Label>
        <Input
          id="bankName"
          name="bankName"
          value={userInfo?.bankName || ""}
          onChange={onChange}
          autoComplete="organization"
          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="branchName" className="text-blue-800">
          Branch Name
        </Label>
        <Input
          id="branchName"
          name="branchName"
          value={userInfo?.branchName || ""}
          onChange={onChange}
          autoComplete="off"
          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rib" className="text-blue-800">
          RIB
        </Label>
        <Input
          id="rib"
          name="rib"
          value={userInfo?.rib || ""}
          onChange={onChange}
          autoComplete="off"
          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          className="text-blue-500 border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />
        <label htmlFor="terms" className="text-sm text-blue-700">
          I certify that I am the holder of this bank/postal account
        </label>
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Save Changes</Button>
      </motion.div>
    </div>
  </motion.div>
)

const Donations = () => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-6 text-blue-900">My Donations</h2>
    <motion.div
      className="text-center py-12"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <CreditCard className="w-12 h-12 mx-auto text-blue-400 mb-4" />
      <p className="text-blue-600">No donation requests found</p>
    </motion.div>
  </motion.div>
)

const Participations = () => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-6 text-blue-900">My Participations</h2>
    <motion.div
      className="text-center py-12"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <HandHeart className="w-12 h-12 mx-auto text-blue-400 mb-4" />
      <p className="text-blue-600">No participations found</p>
    </motion.div>
  </motion.div>
)

const PasswordChange = () => (
  <div className="grid gap-6">
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Change Password</h2>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="currentPassword" className="text-blue-800">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="newPassword" className="text-blue-800">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" className="text-blue-800">
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Change Password</Button>
        </motion.div>
      </div>
    </motion.div>

    <motion.div
      className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Link Social Accounts</h2>
      <div className="space-y-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-50">
            <Mail className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-50">
            <Mail className="mr-2 h-4 w-4" />
            Continue with Facebook
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-50">
            <Mail className="mr-2 h-4 w-4" />
            Continue with Twitter
          </Button>
        </motion.div>
      </div>
    </motion.div>
  </div>
)

const DashboardOverview = ({ userInfo, setActiveSection }) => {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center text-red-600">
            <span className="mr-2">•</span>
            <p>Identity document: Missing</p>
          </div>
          <div className="flex items-center text-red-600">
            <span className="mr-2">•</span>
            <p>Identity document (back): Missing</p>
          </div>
        </div>
        <div className="mt-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setActiveSection("documents")}
              variant="outline"
              className="text-blue-600 border-blue-500 hover:bg-blue-50"
            >
              Modifier
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Mes Coordonnées</h2>
          <div className="space-y-2">
            <p className="text-blue-700">
              <span className="font-semibold text-blue-800">Nom:</span> {userInfo?.nom || "Non renseigné"}
            </p>
            <p className="text-blue-700">
              <span className="font-semibold text-blue-800">Prénom:</span> {userInfo?.prenom || "Non renseigné"}
            </p>
            <p className="text-blue-700">
              <span className="font-semibold text-blue-800">Adresse:</span> {userInfo?.adresse || "Non renseignée"}
            </p>
            <p className="text-blue-700">
              <span className="font-semibold text-blue-800">Téléphone:</span> {userInfo?.telephone || "Non renseigné"}
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setActiveSection("my-info")}
                variant="outline"
                className="w-full mt-4 text-blue-600 border-blue-500 hover:bg-blue-50"
              >
                Modifier
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Mes Infos de Connexion</h2>
          <div className="space-y-2">
            <p className="text-blue-700">
              <span className="font-semibold text-blue-800">Email:</span> {userInfo?.email || "Non renseigné"}
            </p>
            <p className="text-blue-700">
              <span className="font-semibold text-blue-800">Mot de passe:</span> ••••••••
            </p>
            <p className="text-blue-700">
              <span className="font-semibold text-blue-800">Comptes associés:</span>
            </p>
            <div className="flex gap-2 mt-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-blue-300 text-blue-500">
                  <span className="sr-only">Facebook</span>f
                </Button>
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-blue-300 text-blue-500">
                  <span className="sr-only">Google</span>g
                </Button>
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-blue-300 text-blue-500">
                  <span className="sr-only">Twitter</span>t
                </Button>
              </motion.button>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setActiveSection("my-info")}
                variant="outline"
                className="w-full mt-4 text-blue-600 border-blue-500 hover:bg-blue-50"
              >
                Modifier
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Nous contacter</h2>
          <div className="flex justify-center gap-8">
            <motion.div
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Phone className="w-12 h-12 mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-blue-700">Par téléphone</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Mail className="w-12 h-12 mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-blue-700">Par email</p>
            </motion.div>
          </div>
          <div className="mt-6 text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/contact")}
                variant="outline"
                className="text-blue-600 border-blue-500 hover:bg-blue-50"
              >
                Voir les moyens de contact
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Une question ?</h2>
          <motion.div
            className="text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <HelpCircle className="w-12 h-12 mx-auto text-blue-500 mb-2" />
            <p className="text-sm mb-6 text-blue-700">Consultez notre FAQ</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/about")}
                variant="outline"
                className="text-blue-600 border-blue-500 hover:bg-blue-50"
              >
                Consulter la FAQ
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

