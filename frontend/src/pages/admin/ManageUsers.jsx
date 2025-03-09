"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Trash2, UserPlus, X } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/admin/dashboard"
              className="flex items-center text-blue-300 hover:text-blue-100 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">User List</h2>
            <motion.button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus size={20} className="mr-2" />
              Add New User
            </motion.button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-4">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
              <p className="mt-2 text-sm">Make sure you are logged in as an admin user to access this page.</p>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-800/50">
                  <th className="p-3 text-blue-100">Nom</th>
                  <th className="p-3 text-blue-100">Prénom</th>
                  <th className="p-3 text-blue-100">Age</th>
                  <th className="p-3 text-blue-100">Adresse</th>
                  <th className="p-3 text-blue-100">Télephone</th>
                  <th className="p-3 text-blue-100">Email</th>
                  <th className="p-3 text-blue-100">Role</th>
                  <th className="p-3 text-blue-100">Actions</th>
                </tr>
                {isLoading && (
                  <tr>
                    <td colSpan="8" className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-300"></div>
                        <span className="ml-3 text-blue-200">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    className="border-b border-blue-700/30 hover:bg-blue-800/30 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index < 5 ? 0.05 * index : 0 }}
                  >
                    <td className="p-3">{user.nom}</td>
                    <td className="p-3">{user.prenom}</td>
                    <td className="p-3">{user.age}</td>
                    <td className="p-3">{user.adresse}</td>
                    <td className="p-3">{user.telephone}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role || (user.isAdmin ? "admin" : "user")}</td>
                    <td className="p-3 flex">
                      <motion.button
                        className="text-blue-300 hover:text-blue-100 mr-3"
                        onClick={() => handleEditUser(user)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteUser(user._id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isEditModalOpen && editingUser && (
          <motion.div
            className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md p-6 rounded-lg w-96 border border-blue-500/30 text-white"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit User</h2>
                <motion.button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-blue-200 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="nom">
                    Nom
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="nom"
                    name="nom"
                    type="text"
                    value={editingUser.nom}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="prenom">
                    Prénom
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={editingUser.prenom}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="age">
                    Age
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="age"
                    name="age"
                    type="number"
                    value={editingUser.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="adresse">
                    Adresse
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="adresse"
                    name="adresse"
                    type="text"
                    value={editingUser.adresse}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="telephone">
                    Téléphone
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={editingUser.telephone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="email"
                    name="email"
                    type="email"
                    value={editingUser.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-blue-100 text-sm font-bold mb-2">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={editingUser.role || (editingUser.isAdmin ? "admin" : "user")}
                    onChange={handleInputChange}
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <motion.button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Update User
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md p-6 rounded-lg w-96 border border-blue-500/30 text-white"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New User</h2>
                <motion.button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-blue-200 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="new-nom">
                    Nom
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="new-nom"
                    name="nom"
                    type="text"
                    value={newUser.nom}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="new-prenom">
                    Prénom{" "}
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="new-prenom"
                    name="prenom"
                    type="text"
                    value={newUser.prenom}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="new-age">
                    Age
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="new-age"
                    name="age"
                    type="number"
                    value={newUser.age}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="new-adresse">
                    Adresse
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="new-adresse"
                    name="adresse"
                    type="text"
                    value={newUser.adresse}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="new-telephone">
                    Téléphone
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="new-telephone"
                    name="telephone"
                    type="tel"
                    value={newUser.telephone}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="new-email">
                    Email
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="new-email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div>
                  <label className="block text-blue-100 text-sm font-bold mb-2" htmlFor="new-password">
                    Password
                  </label>
                  <input
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    id="new-password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-blue-100 text-sm font-bold mb-2">Role</label>
                  <select
                    id="new-role"
                    name="role"
                    value={newUser.role}
                    onChange={(e) => handleInputChange(e, true)}
                    className="bg-white/10 border border-blue-500/30 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <motion.button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add User
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            className="fixed bottom-5 right-5 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20 }}
          >
            User action completed successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageUsers

