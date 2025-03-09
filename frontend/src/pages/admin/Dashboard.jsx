"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, DollarSign, Heart, BarChart2, UserPlus, Briefcase, PieChart } from "lucide-react"
import AdminNavbar from "../../components/AdminNavbar"
import { motion } from "framer-motion"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    activeCauses: 0,
    monthlyGrowth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        const baseUrl = "http://localhost:5001/api/dashboard"

        const response = await fetch(`${baseUrl}/stats`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Dashboard data received:", data)

        setStats({
          totalUsers: data.totalUsers,
          activeCauses: data.activeCauses,
          // Use placeholder values for these metrics for now
          totalDonations: 0,
          monthlyGrowth: 0,
        })

        setError(null)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Animated floating hearts for background
  const renderFloatingHearts = () => {
    const hearts = Array(8)
      .fill(0)
      .map((_, i) => ({
        id: i,
        size: Math.random() * 20 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.1 + 0.05,
      }))

    return hearts.map((heart) => (
      <motion.div
        key={heart.id}
        className="absolute text-blue-300 pointer-events-none"
        style={{
          fontSize: heart.size,
          left: `${heart.x}%`,
          top: `${heart.y}%`,
          opacity: 0,
          zIndex: 0,
        }}
        animate={{
          y: [0, -100],
          opacity: [0, heart.opacity, 0],
          scale: [0.5, 1, 0.8],
        }}
        transition={{
          duration: heart.duration,
          repeat: Number.POSITIVE_INFINITY,
          delay: heart.delay,
          ease: "easeInOut",
        }}
      >
        ❤️
      </motion.div>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderFloatingHearts()}

        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full"
          style={{ filter: "blur(80px)", transform: "translate(30%, -30%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full"
          style={{ filter: "blur(80px)", transform: "translate(-30%, 30%)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", delay: 2 }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/src/assets/img/world-map-dots.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        ></div>
      </div>

      <AdminNavbar />
      <motion.div
        className="p-8 pt-24 max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Admin Dashboard
        </motion.h1>

        {error && (
          <motion.div
            className="bg-red-900/30 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            icon={<Users size={28} />}
            title="Total Users"
            value={stats.totalUsers}
            loading={loading}
            color="bg-blue-500"
            delay={0.1}
          />
          <StatCard
            icon={<DollarSign size={28} />}
            title="Total Donations"
            value="Coming soon"
            loading={loading}
            color="bg-blue-600"
            delay={0.2}
          />
          <StatCard
            icon={<Heart size={28} />}
            title="Total Causes"
            value={stats.activeCauses}
            loading={loading}
            color="bg-blue-700"
            delay={0.3}
          />
          <StatCard
            icon={<BarChart2 size={28} />}
            title="Monthly Growth"
            value="Coming soon"
            loading={loading}
            color="bg-blue-800"
            delay={0.4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ActionCard
            icon={<UserPlus size={28} />}
            title="Manage Users"
            description="Add, edit, or remove user accounts"
            action={() => navigate("/admin/users")}
            color="bg-blue-500"
            delay={0.5}
          />
          <ActionCard
            icon={<Briefcase size={28} />}
            title="Manage Causes"
            description="Create, update, or delete charity causes"
            action={() => navigate("/admin/causes")}
            color="bg-blue-600"
            delay={0.6}
          />
          <ActionCard
            icon={<PieChart size={28} />}
            title="View Donations"
            description="See detailed donation reports and analytics"
            action={() => navigate("/admin/donations")}
            color="bg-blue-700"
            delay={0.7}
          />
        </div>
      </motion.div>
    </div>
  )
}

const StatCard = ({ icon, title, value, color, loading, delay = 0 }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-500/20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className={`${color} p-4 text-white`}>{icon}</div>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      {loading ? (
        <div className="h-8 bg-blue-800/30 rounded animate-pulse"></div>
      ) : (
        <p className="text-3xl font-bold text-blue-100">{value}</p>
      )}
    </div>
  </motion.div>
)

const ActionCard = ({ icon, title, description, action, color, delay = 0 }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-500/20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className={`${color} p-4 text-white`}>{icon}</div>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <p className="text-blue-100 mb-6">{description}</p>
      <motion.button
        onClick={action}
        className={`w-full ${color} text-white py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 font-semibold`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Go to {title}
      </motion.button>
    </div>
  </motion.div>
)

export default Dashboard

