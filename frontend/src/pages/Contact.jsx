"use client"

import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import NavigationBar from "../components/NavigationBar"
import UserNavigationBar from "../components/UserNavigationBar"
import AdminNavbar from "../components/AdminNavbar"
import { Mail, Phone, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

const Contact = () => {
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
              <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-sm border border-blue-500/20"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 bg-white/10 border border-blue-500/30 rounded-md focus:ring-blue-400 focus:border-blue-400 text-white placeholder:text-blue-200/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 bg-white/10 border border-blue-500/30 rounded-md focus:ring-blue-400 focus:border-blue-400 text-white placeholder:text-blue-200/50"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-blue-100 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-4 py-2 bg-white/10 border border-blue-500/30 rounded-md focus:ring-blue-400 focus:border-blue-400 text-white placeholder:text-blue-200/50"
                      placeholder="Your message"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-full hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                className="space-y-8"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Mail, title: "Email", info: "contact@charityhub.org" },
                      { icon: Phone, title: "Phone", info: "+1 (555) 123-4567" },
                      { icon: MapPin, title: "Address", info: "123 Charity Street\nNew York, NY 10001\nUnited States" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        className="flex items-start"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <item.icon className="w-6 h-6 text-blue-300 mt-1 mr-4" />
                        <div>
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="text-blue-100 whitespace-pre-line">{item.info}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Office Hours</h3>
                  <div className="space-y-2 text-blue-100">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact

