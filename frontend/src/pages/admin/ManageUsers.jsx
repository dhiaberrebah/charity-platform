"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, Search, UserPlus, Edit2, Trash2, 
  CheckCircle, XCircle, Filter, Download, ArrowLeft, FileDown 
} from "lucide-react"
import AdminNavbar from "../../components/AdminNavbar"
import { useNavigate } from "react-router-dom"

const ManageUsers = () => {
  const navigate = useNavigate()
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
  const [page, setPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const usersPerPage = 50 // Increased from 20 to 50, or remove pagination entirely
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')

  useEffect(() => {
    fetchUsers()
  }, [page])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:5001/api/auth/get?page=${page}&limit=${usersPerPage}`, {
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch users: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setUsers(data.users || data) // Handle both paginated and non-paginated responses
      setTotalUsers(data.total || data.length)
      
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

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
    e.preventDefault();
    try {
      // Validate phone number length
      if (newUser.telephone.length !== 8) {
        alert("Phone number must be 8 characters long");
        return;
      }

      // Validate password length
      if (newUser.password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }

      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nom: newUser.nom,
          prenom: newUser.prenom,
          age: parseInt(newUser.age),
          adresse: newUser.adresse,
          telephone: newUser.telephone,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role || "user"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      const addedUser = await response.json();

      // Update the users list with the new user
      setUsers(prevUsers => [...prevUsers, addedUser]);
      
      // Reset form and close modal
      setNewUser({
        nom: "",
        prenom: "",
        age: "",
        adresse: "",
        telephone: "",
        email: "",
        password: "",
        role: "user",
      });
      setIsAddModalOpen(false);

      // Show success message
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);

    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.message || "Failed to add user. Please try again.");
    }
  }

  const renderPagination = () => {
    if (totalUsers <= usersPerPage) return null

    const totalPages = Math.ceil(totalUsers / usersPerPage)
    
    return (
      <div className="flex justify-between items-center px-6 py-4 bg-white/5">
        <div className="text-sm text-blue-200">
          Showing {((page - 1) * usersPerPage) + 1} to {Math.min(page * usersPerPage, totalUsers)} of {totalUsers} users
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * usersPerPage >= totalUsers}
            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.nom?.toLowerCase().includes(searchLower) ||
          user.prenom?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.telephone?.includes(searchTerm)
        );
      }
      return true;
    })
    .filter(user => {
      // Apply role filter
      if (filterRole === 'all') return true;
      return user.role === filterRole;
    })
    .sort((a, b) => {
      // Apply sorting
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return direction * (`${a.nom} ${a.prenom}`).localeCompare(`${b.nom} ${b.prenom}`);
      }
      if (sortField === 'email') {
        return direction * (a.email || '').localeCompare(b.email || '');
      }
      if (sortField === 'createdAt') {
        return direction * (new Date(a.createdAt) - new Date(b.createdAt));
      }
      return 0;
    });

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Age', 'Role', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...filteredAndSortedUsers.map(user => [
          user.prenom || '',
          user.nom || '',
          user.email || '',
          user.telephone || '',
          user.adresse || '',
          user.age || '',
          user.role || '',
          new Date(user.createdAt).toLocaleDateString()
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const { autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add title with project's primary color
      doc.setTextColor(91, 168, 144); // Primary color from tailwind config (#5BA890)
      doc.setFontSize(16);
      doc.text('Users Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

      // Prepare data for PDF
      const data = filteredAndSortedUsers.map(user => [
        `${user.prenom} ${user.nom}`,
        user.email,
        user.telephone,
        user.adresse,
        user.age,
        user.role,
        new Date(user.createdAt).toLocaleDateString()
      ]);

      // Generate table with project's colors
      autoTable(doc, {
        head: [['Name', 'Email', 'Phone', 'Address', 'Age', 'Role', 'Created At']],
        body: data,
        startY: 30,
        styles: { 
          fontSize: 8,
          textColor: [31, 41, 55] // text-gray-800
        },
        headStyles: { 
          fillColor: [91, 168, 144], // Primary color from tailwind config
          textColor: [255, 255, 255] // White text
        },
        alternateRowStyles: {
          fillColor: [243, 244, 246] // bg-gray-100
        },
        margin: { top: 30 }
      });

      // Save PDF
      doc.save(`users_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8">
      <AdminNavbar />
      <div className="p-8 pt-24 max-w-7xl mx-auto">
        {/* Header Section with Back Button and Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 mb-8"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-blue-300 hover:text-blue-100 transition-colors w-fit"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </motion.button>

          {/* Title and Add User Button */}
          <div className="flex justify-between items-center">
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
          </div>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToCSV}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg flex items-center gap-2 border border-blue-500/30 transition-colors duration-200"
              >
                <FileDown size={20} />
                CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToPDF}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg flex items-center gap-2 border border-purple-500/30 transition-colors duration-200"
              >
                <FileDown size={20} />
                PDF
              </motion.button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 text-center">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/20">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-blue-200 cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-blue-200 cursor-pointer"
                        onClick={() => handleSort('email')}
                      >
                        Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Verification Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-500/10">
                    {filteredAndSortedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-blue-200">
                          No users found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedUsers.map((user) => (
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
                              user.verificationStatus === 'verified' 
                                ? 'bg-green-500/20 text-green-300' 
                                : user.verificationStatus === 'rejected'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {user.verificationStatus === 'verified' 
                                ? 'Verified'
                                : user.verificationStatus === 'rejected'
                                ? 'Rejected'
                                : 'Pending'}
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </>
          )}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Edit User</h2>
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                      <input
                        type="text"
                        name="prenom"
                        value={editingUser?.prenom || ''}
                        onChange={(e) => handleInputChange(e)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="nom"
                        value={editingUser?.nom || ''}
                        onChange={(e) => handleInputChange(e)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editingUser?.email || ''}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <input
                      type="text"
                      name="telephone"
                      value={editingUser?.telephone || ''}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                    <input
                      type="text"
                      name="adresse"
                      value={editingUser?.adresse || ''}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={editingUser?.age || ''}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <select
                      name="role"
                      value={editingUser?.role || 'user'}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Add New User</h2>
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                      <input
                        type="text"
                        name="prenom"
                        value={newUser.prenom}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="nom"
                        value={newUser.nom}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={newUser.age}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                    <input
                      type="text"
                      name="adresse"
                      value={newUser.adresse}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <input
                      type="text"
                      name="telephone"
                      value={newUser.telephone}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      required
                      maxLength="8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <select
                      name="role"
                      value={newUser.role}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ManageUsers

