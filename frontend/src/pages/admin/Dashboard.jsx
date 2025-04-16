"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Users, DollarSign, Heart, BarChart2, UserPlus, 
  Briefcase, CreditCard, Shield, Bell, Settings, 
  TrendingUp, Calendar 
} from "lucide-react"
import AdminNavbar from "../../components/AdminNavbar"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const API_BASE_URL = "http://localhost:5001";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonationsAmount: 0,
    totalDonationsCount: 0,
    activeCauses: 0,
    monthlyGrowth: 0,
    recentDonations: [],
    pendingVerifications: 0,
    totalVerifications: 0,
    topDonors: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [topDonorsPeriod, setTopDonorsPeriod] = useState('week')
  const [topDonorsLoading, setTopDonorsLoading] = useState(false)
  const [topDonorsError, setTopDonorsError] = useState(null)
  const [categoryStats, setCategoryStats] = useState([])
  const [categoryStatsLoading, setCategoryStatsLoading] = useState(true)
  const [categoryStatsError, setCategoryStatsError] = useState(null)
  const navigate = useNavigate()

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const baseUrl = `${API_BASE_URL}/api/dashboard`

        const [statsResponse, monthlyGrowthResponse, topDonorsResponse] = await Promise.all([
          fetch(`${baseUrl}/stats`, {
            credentials: "include",
          }),
          fetch(`${baseUrl}/monthly-growth`, {
            credentials: "include",
          }),
          fetch(`${baseUrl}/top-donors`, {
            credentials: "include",
          })
        ])

        // Check responses and update state accordingly
        const [statsData, monthlyGrowthData, topDonorsData] = await Promise.all([
          statsResponse.json(),
          monthlyGrowthResponse.json(),
          topDonorsResponse.json()
        ])

        setStats({
          ...statsData,
          monthlyGrowth: monthlyGrowthData.percentage,
          topDonors: topDonorsData
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Set up polling interval to refresh data every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setCategoryStatsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/dashboard/category-stats`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch category stats');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Define all possible categories
          const allCategories = [
            'medical',
            'education',
            'emergency',
            'community',
            'environment'
          ];

          // Create a map of existing data
          const dataMap = data.reduce((acc, item) => {
            acc[item.category] = item;
            return acc;
          }, {});

          // Ensure all categories exist with default values
          const completeData = allCategories.map(category => ({
            category,
            totalAmount: 0,
            count: 0,
            activeCausesCount: 0,
            percentage: 0,
            formattedAmount: '$0',
            ...dataMap[category]
          }));

          // Calculate percentages if there are any donations
          const totalDonations = completeData.reduce((sum, item) => sum + item.totalAmount, 0);
          const transformedData = completeData.map(item => ({
            ...item,
            percentage: totalDonations > 0 
              ? ((item.totalAmount / totalDonations) * 100).toFixed(1)
              : 0,
            formattedAmount: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(item.totalAmount)
          }));
          
          console.log('Transformed category stats:', transformedData);
          setCategoryStats(transformedData);
          setCategoryStatsError(null);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching category stats:', error);
        setCategoryStatsError(error.message);
      } finally {
        setCategoryStatsLoading(false);
      }
    };

    fetchCategoryStats();
    const interval = setInterval(fetchCategoryStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add this debug log
  useEffect(() => {
    console.log('Current categoryStats:', categoryStats);
    console.log('Loading state:', categoryStatsLoading);
    console.log('Error state:', categoryStatsError);
  }, [categoryStats, categoryStatsLoading, categoryStatsError]);

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

  const fetchTopDonors = async (period) => {
    try {
      setTopDonorsLoading(true);
      console.log(`Fetching top donors for period: ${period}`);
      const response = await fetch(`${API_BASE_URL}/api/dashboard/top-donors?period=${period}&limit=5`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch top donors');
      }
      
      const data = await response.json();
      console.log('Top donors data:', data);
      
      // Add error checking for empty or invalid data
      if (!Array.isArray(data) || data.length === 0) {
        console.warn(`No donors found for period: ${period}`);
      }
      
      setStats(prev => ({ ...prev, topDonors: data }));
    } catch (error) {
      console.error('Error fetching top donors:', error);
      setTopDonorsError(error.message);
    } finally {
      setTopDonorsLoading(false);
    }
  }

  useEffect(() => {
    fetchTopDonors(topDonorsPeriod)
  }, [topDonorsPeriod])

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
        {/* Remove the world map background div */}
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
            value={formatCurrency(stats.totalDonationsAmount)}
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
          {/* Category Statistics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Donations by Category</h2>
              {categoryStatsLoading && (
                <div className="text-blue-300 text-sm">Updating...</div>
              )}
            </div>
            
            {categoryStatsError ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-400 mb-2">{categoryStatsError}</p>
                  <button 
                    onClick={() => fetchCategoryStats()}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : categoryStatsLoading && categoryStats.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="w-full h-[400px]">
                {categoryStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={categoryStats}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="category" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        allowZero={true}
                        domain={[0, 'auto']}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                        tickFormatter={(value) => `${value}`}
                        allowZero={true}
                        domain={[0, 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value, name) => {
                          if (name === "Total Donations") {
                            return [`$${value.toLocaleString()}`, name];
                          } else if (name === "Active Causes") {
                            return [value, name];
                          }
                          return [value, name];
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#9CA3AF' }}
                        verticalAlign="top"
                        height={36}
                      />
                      <Bar 
                        name="Total Donations" 
                        dataKey="totalAmount" 
                        fill="#60A5FA"
                        radius={[4, 4, 0, 0]}
                        yAxisId="left"
                        minPointSize={5}
                      />
                      <Bar 
                        name="Active Causes" 
                        dataKey="activeCausesCount" 
                        fill="#34D399"
                        radius={[4, 4, 0, 0]}
                        yAxisId="right"
                        minPointSize={5}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-blue-300">No categories available</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Top Donors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Top Donors</h2>
              <select 
                value={topDonorsPeriod}
                onChange={(e) => setTopDonorsPeriod(e.target.value)}
                className="bg-blue-800/30 border-none text-white w-24 rounded-md p-2 outline-none"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
            
            {topDonorsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-lg bg-blue-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20"></div>
                      <div>
                        <div className="h-4 w-24 bg-blue-500/20 rounded"></div>
                        <div className="h-3 w-16 bg-blue-500/20 rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-20 bg-blue-500/20 rounded"></div>
                      <div className="h-3 w-16 bg-blue-500/20 rounded mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : topDonorsError ? (
              <div className="text-center py-8">
                <p className="text-red-400">Failed to load top donors</p>
                <button 
                  onClick={() => fetchTopDonors(topDonorsPeriod)}
                  className="mt-2 text-blue-400 hover:text-blue-300"
                >
                  Try again
                </button>
              </div>
            ) : !stats.topDonors?.length ? (
              <div className="text-center py-8">
                <p className="text-blue-200">No donors found for this period</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topDonors?.map((donor, index) => (
                  <div
                    key={donor.id || index}
                    className="flex items-center justify-between p-4 rounded-lg bg-blue-800/30 hover:bg-blue-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                        index === 1 ? 'bg-gray-400/20 text-gray-300' :
                        index === 2 ? 'bg-amber-600/20 text-amber-300' :
                        'bg-blue-500/20 text-blue-300'
                      } font-semibold`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {donor.name || 'Anonymous Donor'}
                        </p>
                        <p className="text-sm text-blue-300">
                          {donor.donationsCount} donation{donor.donationsCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatCurrency(donor.totalAmount)}</p>
                      <p className="text-sm text-blue-300">total donated</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            icon={<UserPlus className="text-white" size={24} />}
            title="Manage Users"
            description="View and manage user accounts"
            action={() => navigate("/admin/users")}
            color="from-blue-600 to-blue-400"
            count={stats.totalUsers}
            metric="Total Users"
          />
          <QuickActionCard
            icon={<Briefcase className="text-white" size={24} />}
            title="Manage Causes"
            description="Handle charity campaigns"
            action={() => navigate("/admin/causes")}
            color="from-green-600 to-green-400"
            count={stats.activeCauses}
            metric="Active Causes"
          />
          <QuickActionCard
            icon={<Shield className="text-white" size={24} />}
            title="Verifications"
            description={`${stats.pendingVerifications || 0} pending requests`}
            action={() => navigate("/admin/verifications")}
            color="from-yellow-600 to-yellow-400"
            count={stats.totalVerifications || 0}
            metric="Total Verifications"
          />
          <QuickActionCard
            icon={<CreditCard className="text-white" size={24} />}
            title="Manage Donations"
            description="View and track donations"
            action={() => navigate("/admin/donations")}
            color="from-purple-600 to-purple-400"
            count={stats.totalDonationsCount}
            metric="Total Donations"
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

const QuickActionCard = ({ icon, title, description, action, color, count, metric }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={action}
      className={`bg-gradient-to-br ${color} rounded-xl p-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
      
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm w-fit">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white mb-1">{count}</h3>
        <p className="text-sm text-white/80">{metric}</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>

      <div className="absolute bottom-0 right-0 p-4">
        <motion.div
          className="text-white/30"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          →
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard

