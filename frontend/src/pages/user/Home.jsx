import Navbar from "../../components/UserNavigationBar"
import Hero from "../../components/Hero"
import CausesSection from "../../components/CausesSection"
import ImpactMetrics from "../../components/ImpactMetrics"
import SearchBar from "@/components/SearchBar"
import BlogPreview from "@/components/BlogPreview"

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <Hero />
      <SearchBar />
      <CausesSection />
      <BlogPreview />
      <ImpactMetrics />

    </div>
  )
}

export default Home

