import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Causes from "./pages/Causes"
import About from "./pages/About"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/Dashboard"
import ManageUsers from "./pages/admin/ManageUsers"
import ManageCauses from "./pages/admin/ManageCauses"
import ViewDonations from "./pages/admin/ViewDonations"
import UserDashboard from "./pages/user/Dashboard"
import UserHome from "./pages/user/Home"
import AdminHome from "./pages/admin/adminhome"
const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/causes" element={<Causes />} />
          <Route path="/causes/:id" element={<Causes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/causes" element={<ManageCauses />} />
          <Route path="/admin/donations" element={<ViewDonations />} />
          <Route path="/admin/home" element={<AdminHome />} />
          {/* User routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/home" element={<UserHome />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App

