"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Users, DollarSign, Heart, BarChart2, UserPlus, 
  Briefcase, PieChart, Shield, Bell, Settings, 
  TrendingUp, Calendar 
} from "lucide-react"
import AdminNavbar from "../../components/AdminNavbar"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    activeCauses: 0,
    monthlyGrowth: 0,
    recentDonations: [],
    pendingVerifications: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Mock data for the chart
  const chartData = [
    { name: 'Jan', donations: 4000 },
    { name: 'Feb', donations: 3000 },
    { name: 'Mar', donations: 5000 },
    { name: 'Apr', donations: 4500 },
    { name: 'May', donations: 6000 },
    { name: 'Jun', donations: 5500 },
  ]

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
      <div className="p-8 pt-24 max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white">Welcome Back, Admin</h1>
            <p className="text-blue-200 mt-2">Here's what's happening today</p>
          </motion.div>
          
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-blue-800/50 hover:bg-blue-700/50 transition-colors"
            >
              <Bell className="w-5 h-5 text-blue-200" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-blue-800/50 hover:bg-blue-700/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-blue-200" />
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="text-blue-300" size={28} />}
            title="Total Users"
            value={stats.totalUsers}
            trend="+12.5%"
            loading={loading}
            color="from-blue-600/20 to-blue-400/20"
          />
          <StatCard
            icon={<DollarSign className="text-green-300" size={28} />}
            title="Total Donations"
            value={`$${stats.totalDonations || '0'}`}
            trend="+8.2%"
            loading={loading}
            color="from-green-600/20 to-green-400/20"
          />
          <StatCard
            icon={<Heart className="text-red-300" size={28} />}
            title="Active Causes"
            value={stats.activeCauses}
            trend="+5.1%"
            loading={loading}
            color="from-red-600/20 to-red-400/20"
          />
          <StatCard
            icon={<TrendingUp className="text-purple-300" size={28} />}
            title="Monthly Growth"
            value={`${stats.monthlyGrowth || '0'}%`}
            trend="+2.4%"
            loading={loading}
            color="from-purple-600/20 to-purple-400/20"
          />
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Donation Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Donation Trends</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={{ fill: '#60A5FA' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-blue-800/30 hover:bg-blue-700/30 transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <Calendar className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white">New donation received</p>
                    <p className="text-xs text-blue-300">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            icon={<UserPlus size={24} />}
            title="Manage Users"
            description="View and manage user accounts"
            action={() => navigate("/admin/users")}
            color="bg-blue-500"
          />
          <QuickActionCard
            icon={<Briefcase size={24} />}
            title="Manage Causes"
            description="Handle charity campaigns"
            action={() => navigate("/admin/causes")}
            color="bg-green-500"
          />
          <QuickActionCard
            icon={<Shield size={24} />}
            title="Verifications"
            description={`${stats.pendingVerifications || 0} pending requests`}
            action={() => navigate("/admin/verifications")}
            color="bg-yellow-500"
          />
          <QuickActionCard
            icon={<PieChart size={24} />}
            title="Analytics"
            description="View detailed reports"
            action={() => navigate("/admin/analytics")}
            color="bg-purple-500"
          />
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon, title, value, trend, loading, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} backdrop-blur-sm rounded-xl p-6 border border-blue-500/20`}
  >
    <div className="flex justify-between items-start">
      <div className="p-2 rounded-lg bg-white/10">
        {icon}
      </div>
      {trend && (
        <span className="text-sm font-medium text-green-400">
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-medium text-blue-100">{title}</h3>
      {loading ? (
        <div className="h-8 bg-blue-800/30 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      )}
    </div>
  </motion.div>
)

const QuickActionCard = ({ icon, title, description, action, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={action}
    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer border border-blue-500/20 transition-all hover:shadow-lg"
  >
    <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-blue-200">{description}</p>
  </motion.div>
)

export default Dashboard

