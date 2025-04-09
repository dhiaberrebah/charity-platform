import { useLocation } from "react-router-dom"
import Footer from "./Footer"

const Layout = ({ children }) => {
  const location = useLocation()

  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      {/* Don't show footer on admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default Layout
