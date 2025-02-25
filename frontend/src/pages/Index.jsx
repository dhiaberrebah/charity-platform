import NavigationBar from "../components/NavigationBar"
import Hero from "../components/Hero"
import CausesSection from "../components/CausesSection"
import ImpactMetrics from "../components/ImpactMetrics"
import SearchBar from "@/components/SearchBar"
import BlogPreview from "@/components/BlogPreview"

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Hero />
      <SearchBar />
      <CausesSection />
      <BlogPreview />
      <ImpactMetrics />

    </div>
  )
}

export default Index

