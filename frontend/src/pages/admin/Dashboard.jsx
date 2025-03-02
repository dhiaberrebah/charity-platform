"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, DollarSign, Heart, BarChart2, UserPlus, Briefcase, PieChart } from "lucide-react"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    activeCauses: 0,
    monthlyGrowth: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard-stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard icon={<Users size={28} />} title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
          <StatCard
            icon={<DollarSign size={28} />}
            title="Total Donations"
            value={`$${stats.totalDonations.toLocaleString()}`}
            color="bg-green-500"
          />
          <StatCard icon={<Heart size={28} />} title="Active Causes" value={stats.activeCauses} color="bg-red-500" />
          <StatCard
            icon={<BarChart2 size={28} />}
            title="Monthly Growth"
            value={`${stats.monthlyGrowth}%`}
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

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className={`${color} p-4 text-white`}>{icon}</div>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
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

