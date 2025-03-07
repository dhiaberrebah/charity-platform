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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import MyCauses from "@/components/MyCauses"

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
      return <div>Loading...</div>
    }

    if (error) {
      return <div>Error: {error}</div>
    }

    switch (activeSection) {
      case "my-info":
        return <UserInformation userInfo={userInfo} onChange={handleInputChange} />
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
    <div className="min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <button onClick={() => navigate("/")} className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold text-gray-900">CharityHub</span>
          </button>
        </div>
        <nav className="px-4 py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeSection === item.id ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  )
}

const UserInformation = ({ userInfo, onChange }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveChanges = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const response = await fetch("http://localhost:5001/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userInfo),
      })

      if (!response.ok) {
        throw new Error("Failed to save changes")
      }

      const updatedUser = await response.json()
      onChange(null, updatedUser.user)
      setSaveSuccess(true)
    } catch (error) {
      setSaveError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">My Information</h2>
      <form onSubmit={handleSaveChanges} className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-gray-400" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full">
              <Camera size={16} />
            </button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={userInfo?.email || ""} onChange={onChange} autoComplete="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" value={userInfo?.nom || ""} onChange={onChange} autoComplete="family-name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              name="prenom"
              value={userInfo?.prenom || ""}
              onChange={onChange}
              autoComplete="given-name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={userInfo?.age || ""}
              onChange={onChange}
              autoComplete="age"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              name="adresse"
              value={userInfo?.adresse || ""}
              onChange={onChange}
              autoComplete="street-address"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              name="telephone"
              value={userInfo?.telephone || ""}
              onChange={onChange}
              autoComplete="tel"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          {saveError && <p className="text-red-500">{saveError}</p>}
          {saveSuccess && <p className="text-green-500">Changes saved successfully!</p>}
        </div>
      </form>
    </div>
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">My Documents</h2>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Identity Documents</h3>

        <div className="flex gap-4 flex-col md:flex-row">
          {/* Front Document */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Front side of ID</p>
            <div
              className={`border-2 border-dashed ${frontPreview ? "border-primary" : "border-gray-300"} rounded-lg p-4 text-center relative overflow-hidden cursor-pointer`}
              onClick={() => frontInputRef.current.click()}
            >
              {frontPreview ? (
                <>
                  <img
                    src={frontPreview || "/placeholder.svg"}
                    alt="ID Front Preview"
                    className="mx-auto max-h-32 object-contain mb-2"
                  />
                  <p className="text-sm text-gray-600">{frontDocument.name}</p>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <Camera className="w-8 h-8 mx-auto text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Upload front side</p>
                  <p className="text-xs text-gray-500">JPG, PNG or PDF accepted</p>
                </>
              )}
              <input
                type="file"
                ref={frontInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange(e, "front")}
              />
            </div>
          </div>

          {/* Back Document */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Back side of ID</p>
            <div
              className={`border-2 border-dashed ${backPreview ? "border-primary" : "border-gray-300"} rounded-lg p-4 text-center relative overflow-hidden cursor-pointer`}
              onClick={() => backInputRef.current.click()}
            >
              {backPreview ? (
                <>
                  <img
                    src={backPreview || "/placeholder.svg"}
                    alt="ID Back Preview"
                    className="mx-auto max-h-32 object-contain mb-2"
                  />
                  <p className="text-sm text-gray-600">{backDocument.name}</p>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <Camera className="w-8 h-8 mx-auto text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Upload back side</p>
                  <p className="text-xs text-gray-500">JPG, PNG or PDF accepted</p>
                </>
              )}
              <input
                type="file"
                ref={backInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange(e, "back")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upload button and status message */}
      <div>
        <Button
          className="w-full flex items-center justify-center gap-2"
          onClick={handleUpload}
          disabled={uploading || (!frontDocument && !backDocument)}
        >
          {uploading ? "Uploading..." : "Submit Documents"}
        </Button>

        {uploadStatus.message && (
          <div
            className={`mt-4 p-3 rounded-md ${uploadStatus.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {uploadStatus.message}
          </div>
        )}
      </div>
    </div>
  )
}

const BankDetails = ({ userInfo, onChange }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Bank Details</h2>
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="bankHolder">Account Holder Name</Label>
        <Input
          id="bankHolder"
          name="bankHolder"
          value={userInfo?.bankHolder || ""}
          onChange={onChange}
          autoComplete="name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          name="bankName"
          value={userInfo?.bankName || ""}
          onChange={onChange}
          autoComplete="organization"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="branchName">Branch Name</Label>
        <Input
          id="branchName"
          name="branchName"
          value={userInfo?.branchName || ""}
          onChange={onChange}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rib">RIB</Label>
        <Input id="rib" name="rib" value={userInfo?.rib || ""} onChange={onChange} autoComplete="off" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I certify that I am the holder of this bank/postal account
        </label>
      </div>
      <Button className="w-full">Save Changes</Button>
    </div>
  </div>
)

const Donations = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">My Donations</h2>
    <div className="text-center py-12">
      <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600">No donation requests found</p>
    </div>
  </div>
)

const Participations = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">My Participations</h2>
    <div className="text-center py-12">
      <HandHeart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600">No participations found</p>
    </div>
  </div>
)

const PasswordChange = () => (
  <div className="grid gap-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" autoComplete="current-password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" autoComplete="new-password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" />
        </div>
        <Button className="w-full">Change Password</Button>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Link Social Accounts</h2>
      <div className="space-y-4">
        <Button variant="outline" className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Continue with Facebook
        </Button>
        <Button variant="outline" className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Continue with Twitter
        </Button>
      </div>
    </div>
  </div>
)

const DashboardOverview = ({ userInfo, setActiveSection }) => {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Notifications</h2>
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
          <Button
            onClick={() => setActiveSection("documents")}
            variant="outline"
            className="text-yellow-600 border-yellow-500 hover:bg-yellow-50"
          >
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Mes Coordonnées</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Nom:</span> {userInfo?.nom || "Non renseigné"}
            </p>
            <p>
              <span className="font-semibold">Prénom:</span> {userInfo?.prenom || "Non renseigné"}
            </p>
            <p>
              <span className="font-semibold">Adresse:</span> {userInfo?.adresse || "Non renseignée"}
            </p>
            <p>
              <span className="font-semibold">Téléphone:</span> {userInfo?.telephone || "Non renseigné"}
            </p>
            <Button
              onClick={() => setActiveSection("my-info")}
              variant="outline"
              className="w-full mt-4 text-yellow-600 border-yellow-500 hover:bg-yellow-50"
            >
              Modifier
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Mes Infos de Connexion</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Email:</span> {userInfo?.email || "Non renseigné"}
            </p>
            <p>
              <span className="font-semibold">Mot de passe:</span> ••••••••
            </p>
            <p>
              <span className="font-semibold">Comptes associés:</span>
            </p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                <span className="sr-only">Facebook</span>f
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                <span className="sr-only">Google</span>g
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                <span className="sr-only">Twitter</span>t
              </Button>
            </div>
            <Button
              onClick={() => setActiveSection("my-info")}
              variant="outline"
              className="w-full mt-4 text-yellow-600 border-yellow-500 hover:bg-yellow-50"
            >
              Modifier
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Nous contacter</h2>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto text-gray-700 mb-2" />
              <p className="text-sm">Par téléphone</p>
            </div>
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto text-gray-700 mb-2" />
              <p className="text-sm">Par email</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              className="text-yellow-600 border-yellow-500 hover:bg-yellow-50"
            >
              Voir les moyens de contact
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Une question ?</h2>
          <div className="text-center">
            <HelpCircle className="w-12 h-12 mx-auto text-gray-700 mb-2" />
            <p className="text-sm mb-6">Consultez notre FAQ</p>
            <Button
              onClick={() => navigate("/about")}
              variant="outline"
              className="text-yellow-600 border-yellow-500 hover:bg-yellow-50"
            >
              Consulter la FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

