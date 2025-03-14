import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from "./components/ProtectedRoute"

// Public pages
import Index from "./pages/Index"
import Causes from "./pages/Causes"
import About from "./pages/About"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import Unauthorized from "./pages/Unauthorized"

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard"
import ManageUsers from "./pages/admin/ManageUsers"
import ManageCauses from "./pages/admin/ManageCauses"
import ViewDonations from "./pages/admin/ViewDonations"
import AdminHome from "./pages/admin/adminhome"
import AdminNotificationsPage from "./pages/admin/NotificationsPage" // Import the NotificationsPage

// User pages
import UserDashboard from "./pages/user/Dashboard"
import UserHome from "./pages/user/Home"
import NotificationsPage from "./pages/user/UserNotificationsPage"

// Cause Share Route
import CauseShare from "./pages/CauseShare"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/causes" element={<Causes />} />
            <Route path="/causes/:id" element={<Causes />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Public Only Routes (redirect if logged in) */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/home" element={<UserHome />} />
              <Route path="/user/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/causes" element={<ManageCauses />} />
                <Route path="/admin/donations" element={<ViewDonations />} />
                <Route path="/admin/home" element={<AdminHome />} />
                <Route path="/admin/notifications" element={<AdminNotificationsPage />} />{" "}
                {/* Add the NotificationsPage route */}
              </Route>
            </Route>

            {/* Cause Share Route */}
            <Route path="/causes/share/:shareUrl" element={<CauseShare />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App

