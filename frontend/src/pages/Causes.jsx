import NavigationBar from "../components/NavigationBar"
import CausesSection from "../components/CausesSection"

const Causes = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Causes</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the various initiatives we're supporting and join us in making a difference.
              </p>
            </div>
          </div>
        </div>

        {/* Causes Grid */}
        <CausesSection />
      </div>
    </div>
  )
}

export default Causes

