"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, Search, UserPlus, Edit2, Trash2, 
  CheckCircle, XCircle, Filter, Download 
} from "lucide-react"
import AdminNavbar from "../../components/AdminNavbar"

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    age: "",
    adresse: "",
    telephone: "",
    email: "",
    password: "", // Include password for new user
    role: "user",
  })
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsers([]) // Clear existing users first
        setIsLoading(true) // Add loading state
        setError(null) // Clear any previous errors

        const response = await fetch("http://localhost:5001/api/auth/get", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          // Limit initial render to first 20 users if there are many
          setUsers(data.slice(0, 20))
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Failed to fetch users: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        setError(error.message || "Failed to load users. Please try refreshing the page.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/auth/users/${userId}`, {
          method: "DELETE",
          credentials: "include",
        })

        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId))
          setShowSuccessPopup(true)
          setTimeout(() => setShowSuccessPopup(false), 3000)
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Failed to delete user")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        alert(error.message || "Failed to delete user. Please try again.")
      }
    }
  }

  const handleEditUser = (user) => {
    setEditingUser({ ...user })
    setIsEditModalOpen(true)
  }

  const handleInputChange = (e, isNewUser = false) => {
    const { name, value } = e.target
    if (isNewUser) {
      setNewUser((prev) => ({ ...prev, [name]: value }))
    } else {
      setEditingUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5001/api/auth/users/${editingUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
        setIsEditModalOpen(false)
        setEditingUser(null)
        setShowSuccessPopup(true)
        setTimeout(() => setShowSuccessPopup(false), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert(error.message || "Failed to update user. Please try again.")
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5001/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        const addedUser = await response.json()
        setUsers((prevUsers) => [...prevUsers, addedUser])
        setIsAddModalOpen(false)
        setNewUser({
          nom: "",
          prenom: "",
          age: "",
          adresse: "",
          telephone: "",
          email: "",
          password: "",
          role: "user",
        })
        setShowSuccessPopup(true)
        setTimeout(() => setShowSuccessPopup(false), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to add user")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      alert(error.message || "Failed to add user. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <AdminNavbar />
      
      <div className="p-8 pt-24 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Users</h1>
            <p className="text-blue-200 mt-2">View and manage user accounts</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add New User
          </motion.button>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-blue-300" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-blue-500/20 rounded-lg text-white placeholder-blue-300"
                onChange={(e) => {/* Your search logic */}}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2">
                <Filter size={20} />
                Filter
              </button>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2">
                <Download size={20} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/10">
                {users.map((user) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-blue-500/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Users size={20} className="text-blue-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{`${user.nom} ${user.prenom}`}</p>
                          <p className="text-sm text-blue-300">{user.telephone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-blue-200">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditUser(user)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300"
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Success Popup */}
        <AnimatePresence>
          {showSuccessPopup && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              Operation completed successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Edit User</h2>
                {/* Your existing edit form with styled inputs */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Add New User</h2>
                {/* Your existing add form with styled inputs */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ManageUsers

