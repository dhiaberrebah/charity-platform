"use client"
import NavigationBar from "@/components/Navbar"
import { useState } from "react"
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

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St",
    phone: "555-0123",
    bankHolder: "",
    bankName: "",
    branchName: "",
    rib: "",
  })

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

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  const renderContent = () => {
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
        return <DashboardOverview userInfo={userInfo} />
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

const UserInformation = ({ userInfo, onChange }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">My Information</h2>
    <div className="space-y-6">
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
          <Input id="email" name="email" value={userInfo.email} onChange={onChange} autoComplete="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={userInfo.firstName}
            onChange={onChange}
            autoComplete="given-name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={userInfo.lastName}
            onChange={onChange}
            autoComplete="family-name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={userInfo.address}
            onChange={onChange}
            autoComplete="street-address"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={userInfo.phone} onChange={onChange} autoComplete="tel" />
        </div>
        <Button className="w-full">Save Changes</Button>
      </div>
    </div>
  </div>
)

const DocumentUpload = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">My Documents</h2>
    <div className="bg-yellow-50 p-4 rounded-lg mb-6">
      <h3 className="font-semibold mb-2">Identity Documents</h3>
      <div className="flex gap-4">
        <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="mb-4">
            <Camera className="w-8 h-8 mx-auto text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Upload front side</p>
          <p className="text-xs text-gray-500">JPG, PNG or PDF accepted</p>
        </div>
        <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="mb-4">
            <Camera className="w-8 h-8 mx-auto text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Upload back side</p>
          <p className="text-xs text-gray-500">JPG, PNG or PDF accepted</p>
        </div>
      </div>
    </div>
    <Button className="w-full">Submit Documents</Button>
  </div>
)

const BankDetails = ({ userInfo, onChange }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Bank Details</h2>
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="bankHolder">Account Holder Name</Label>
        <Input id="bankHolder" name="bankHolder" value={userInfo.bankHolder} onChange={onChange} autoComplete="name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          name="bankName"
          value={userInfo.bankName}
          onChange={onChange}
          autoComplete="organization"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="branchName">Branch Name</Label>
        <Input id="branchName" name="branchName" value={userInfo.branchName} onChange={onChange} autoComplete="off" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rib">RIB</Label>
        <Input id="rib" name="rib" value={userInfo.rib} onChange={onChange} autoComplete="off" />
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

const DashboardOverview = ({ userInfo }) => {
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
          <Button variant="outline" className="text-yellow-600 border-yellow-500 hover:bg-yellow-50">
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Mes Coordonnées</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Nom:</span> {userInfo.lastName}
            </p>
            <p>
              <span className="font-semibold">Prénom:</span> {userInfo.firstName}
            </p>
            <p>
              <span className="font-semibold">Adresse:</span> {userInfo.address}
            </p>
            <p>
              <span className="font-semibold">Téléphone:</span> {userInfo.phone}
            </p>
            <Button variant="outline" className="w-full mt-4 text-yellow-600 border-yellow-500 hover:bg-yellow-50">
              Modifier
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Mes Infos de Connexion</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Email:</span> {userInfo.email}
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
            <Button variant="outline" className="w-full mt-4 text-yellow-600 border-yellow-500 hover:bg-yellow-50">
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

const MyCauses = () => {
  const navigate = useNavigate()

  const handleCreateCause = () => {
    navigate("/causes/create")
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Causes</h2>
        <Button onClick={handleCreateCause} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          Create New Cause
        </Button>
      </div>

      {/* Empty state */}
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
        <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">You haven't created any causes yet</p>
        <p className="text-sm text-gray-500 mb-4">Create your first cause to start collecting donations</p>
        <Button onClick={handleCreateCause} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          Lancez-vous ! Créez votre Cha9a9a
        </Button>
      </div>
    </div>
  )
}

export default Dashboard

