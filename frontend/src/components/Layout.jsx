import { useLocation } from "react-router-dom"
import Footer from "./Footer"

const Layout = ({ children }) => {
  const location = useLocation()

  // Check if the current route is an admin route or the dashboard page
  const isAdminRoute = location.pathname.startsWith("/admin")
  const isDashboardPage = location.pathname.includes("/dashboard")

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      {/* Don't show footer on admin routes or dashboard page */}
      {!isAdminRoute && !isDashboardPage && <Footer />}
    </div>
  )
}

export default Layout
