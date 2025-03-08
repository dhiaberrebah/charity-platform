import AdminNavbar from "../../components/AdminNavbar"
import Hero from "../../components/Hero"
import CausesSection from "../../components/CausesSection"
import ImpactMetrics from "../../components/ImpactMetrics"
import SearchBar from "@/components/SearchBar"
import BlogPreview from "@/components/BlogPreview"

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <Hero />
      <SearchBar />
      <CausesSection />
      <BlogPreview />
      <ImpactMetrics />
    </div>
  )
}

export default AdminHome

