import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import VerificationManager from "./components/admin/VerificationManager"
import AIChatAssistant from "./components/AIChatAssistant"

// Public pages
import Index from "./pages/Index"
import Causes from "./pages/Causes"
import About from "./pages/About"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import Unauthorized from "./pages/Unauthorized"
import FAQ from "./pages/FAQ"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"
import CookiePolicy from "./pages/CookiePolicy"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard"
import ManageUsers from "./pages/admin/ManageUsers"
import ManageCauses from "./pages/admin/ManageCauses"
import ViewDonations from "./pages/admin/ViewDonations"
import AdminHome from "./pages/admin/adminhome"
import AdminNotificationsPage from "./pages/admin/NotificationsPage"

// User pages
import UserDashboard from "./pages/user/Dashboard"
import UserHome from "./pages/user/Home"
import NotificationsPage from "./pages/user/UserNotificationsPage"

// Cause Share Route
import CauseShare from "./pages/CauseShare"
// Add Comments page import
import CauseComments from "./pages/CauseComments"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/causes" element={<Causes />} />
              <Route path="/causes/:id" element={<Causes />} />
              {/* Add the comments route */}
              <Route path="/causes/:id/comments" element={<CauseComments />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />

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
                  <Route path="/admin/verifications" element={<VerificationManager />} />
                  <Route path="/admin/home" element={<AdminHome />} />
                  <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                </Route>
              </Route>

              {/* Cause Share Route */}
              <Route path="/cause/share/:shareUrl" element={<CauseShare />} />

              {/* Blog Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AIChatAssistant />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
