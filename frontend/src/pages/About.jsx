import NavigationBar from "../components/NavigationBar"
import { Heart, Users, Globe, Target } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About CharityHub</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're on a mission to create positive change and make the world a better place.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  CharityHub was founded with a simple but powerful mission: to connect generous donors with meaningful
                  causes around the world. We believe that everyone has the power to make a difference, no matter how
                  small the contribution.
                </p>
                <p className="text-gray-600">
                  Through our platform, we've helped raise millions of dollars for various causes, from providing clean
                  water to communities in need to supporting education initiatives and protecting wildlife.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <Heart className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Care</h3>
                  <p className="text-gray-600">Supporting those in need with compassion</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <Users className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600">Building stronger communities together</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <Globe className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Global</h3>
                  <p className="text-gray-600">Making an impact worldwide</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact</h3>
                  <p className="text-gray-600">Achieving measurable results</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">$10M+</div>
                <div className="text-gray-600">Funds Raised</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">Successful Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100K+</div>
                <div className="text-gray-600">Donors</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600">Countries Reached</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About

