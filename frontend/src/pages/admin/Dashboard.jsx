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
    // Fetch dashboard stats from your API
    const fetchStats = async () => {
      try {
        // Replace with your actual API call
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<Users size={24} />} title="Total Users" value={stats.totalUsers} />
        <StatCard
          icon={<DollarSign size={24} />}
          title="Total Donations"
          value={`$${stats.totalDonations.toLocaleString()}`}
        />
        <StatCard icon={<Heart size={24} />} title="Active Causes" value={stats.activeCauses} />
        <StatCard icon={<BarChart2 size={24} />} title="Monthly Growth" value={`${stats.monthlyGrowth}%`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          icon={<UserPlus size={24} />}
          title="Manage Users"
          description="Add, edit, or remove user accounts"
          action={() => navigate("/admin/users")}
        />
        <ActionCard
          icon={<Briefcase size={24} />}
          title="Manage Causes"
          description="Create, update, or delete charity causes"
          action={() => navigate("/admin/causes")}
        />
        <ActionCard
          icon={<PieChart size={24} />}
          title="View Donations"
          description="See detailed donation reports and analytics"
          action={() => navigate("/admin/donations")}
        />
      </div>
    </div>
  )
}

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <div className="text-blue-500">{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
)

const ActionCard = ({ icon, title, description, action }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      <div className="text-blue-500 mr-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <button
      onClick={action}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
    >
      Go to {title}
    </button>
  </div>
)

export default Dashboard

