"use client"

import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import NavigationBar from "../components/NavigationBar"
import UserNavigationBar from "../components/UserNavigationBar"
import AdminNavbar from "../components/AdminNavbar"
import { Heart, Users, Globe, Target } from "lucide-react"
import { useState, useEffect } from "react"

const About = () => {
  const [navbar, setNavbar] = useState(<NavigationBar />)
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    if (isAdmin) {
      setNavbar(<AdminNavbar />)
    } else if (isAuthenticated) {
      setNavbar(<UserNavigationBar />)
    } else {
      setNavbar(<NavigationBar />)
    }
  }, [isAuthenticated, isAdmin])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      {navbar}
      <div className="pt-16">
        {/* Hero Section */}
        <motion.div
          className="bg-gradient-to-b from-blue-800/50 to-indigo-900/50 backdrop-blur-sm py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white mb-4">About CharityHub</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                We're on a mission to create positive change and make the world a better place.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-blue-100 mb-6">
                  CharityHub was founded with a simple but powerful mission: to connect generous donors with meaningful
                  causes around the world. We believe that everyone has the power to make a difference, no matter how
                  small the contribution.
                </p>
                <p className="text-blue-100">
                  Through our platform, we've helped raise millions of dollars for various causes, from providing clean
                  water to communities in need to supporting education initiatives and protecting wildlife.
                </p>
              </motion.div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Heart, title: "Care", desc: "Supporting those in need with compassion" },
                  { icon: Users, title: "Community", desc: "Building stronger communities together" },
                  { icon: Globe, title: "Global", desc: "Making an impact worldwide" },
                  { icon: Target, title: "Impact", desc: "Achieving measurable results" },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-blue-500/20"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                  >
                    <item.icon className="w-8 h-8 text-blue-300 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-blue-100">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <motion.section
          className="bg-blue-900/50 backdrop-blur-sm py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "$10M+", label: "Funds Raised" },
                { value: "500+", label: "Successful Projects" },
                { value: "100K+", label: "Donors" },
                { value: "50+", label: "Countries Reached" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <motion.div
                    className="text-4xl font-bold text-blue-300 mb-2"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default About

