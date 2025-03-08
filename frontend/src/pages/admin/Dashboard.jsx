"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, DollarSign, Heart, BarChart2, UserPlus, Briefcase, PieChart } from "lucide-react"
import AdminNavbar from "../../components/AdminNavbar"

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <AdminNavbar />
      <div className="p-8 pt-24 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            icon={<Users size={28} />}
            title="Total Users"
            value={stats.totalUsers}
            loading={loading}
            color="bg-blue-500"
          />
          <StatCard
            icon={<DollarSign size={28} />}
            title="Total Donations"
            value="Coming soon"
            loading={loading}
            color="bg-green-500"
          />
          <StatCard
            icon={<Heart size={28} />}
            title="Total Causes"
            value={stats.activeCauses}
            loading={loading}
            color="bg-red-500"
          />
          <StatCard
            icon={<BarChart2 size={28} />}
            title="Monthly Growth"
            value="Coming soon"
            loading={loading}
            color="bg-purple-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ActionCard
            icon={<UserPlus size={28} />}
            title="Manage Users"
            description="Add, edit, or remove user accounts"
            action={() => navigate("/admin/users")}
            color="bg-blue-500"
          />
          <ActionCard
            icon={<Briefcase size={28} />}
            title="Manage Causes"
            description="Create, update, or delete charity causes"
            action={() => navigate("/admin/causes")}
            color="bg-green-500"
          />
          <ActionCard
            icon={<PieChart size={28} />}
            title="View Donations"
            description="See detailed donation reports and analytics"
            action={() => navigate("/admin/donations")}
            color="bg-purple-500"
          />
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon, title, value, color, loading }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className={`${color} p-4 text-white`}>{icon}</div>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
)

const ActionCard = ({ icon, title, description, action, color }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className={`${color} p-4 text-white`}>{icon}</div>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <button
        onClick={action}
        className={`w-full ${color} text-white py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 font-semibold`}
      >
        Go to {title}
      </button>
    </div>
  </div>
)

export default Dashboard

