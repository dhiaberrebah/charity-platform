import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, ShieldOff, Check, X, CheckCircle, XCircle, ArrowLeft, FileDown, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";

const VerificationManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportAttempts, setExportAttempts] = useState(0);

  const handleExportWithRetry = async (exportFunction, maxAttempts = 3) => {
    setIsExporting(true);
    setExportAttempts(prev => prev + 1);

    try {
      await exportFunction();
      setExportAttempts(0); // Reset attempts on success
    } catch (error) {
      console.error('Export error:', error);
      
      if (exportAttempts < maxAttempts) {
        toast.error(`Export failed. Retrying... (Attempt ${exportAttempts + 1}/${maxAttempts})`);
        setTimeout(() => handleExportWithRetry(exportFunction, maxAttempts), 1500);
      } else {
        toast.error('Export failed after multiple attempts. Please try again later.');
        setExportAttempts(0);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    return new Promise((resolve, reject) => {
      try {
        const headers = ['Name', 'Email', 'Phone', 'Verification Status', 'Submission Date', 'Document Type'];
        const csvContent = [
          headers.join(','),
          ...users.map(user => [
            `${user.prenom} ${user.nom}`,
            user.email,
            user.telephone,
            user.verificationStatus,
            new Date(user.verificationDate).toLocaleDateString(),
            user.documents?.type || 'N/A'
          ].map(field => `"${field}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `verifications_export_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        toast.success('Verifications exported to CSV successfully');
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const exportToPDF = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { jsPDF } = await import('jspdf');
        const { autoTable } = await import('jspdf-autotable');
        
        const doc = new jsPDF();
        
        doc.setTextColor(91, 168, 144);
        doc.setFontSize(16);
        doc.text('Verification Requests Report', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

        const data = users.map(user => [
          `${user.prenom} ${user.nom}`,
          user.email,
          user.telephone,
          user.verificationStatus,
          new Date(user.verificationDate).toLocaleDateString(),
          user.documents?.type || 'N/A'
        ]);

        autoTable(doc, {
          head: [['Name', 'Email', 'Phone', 'Status', 'Submission Date', 'Document Type']],
          body: data,
          startY: 30,
          styles: { fontSize: 8, textColor: [31, 41, 55] },
          headStyles: { fillColor: [91, 168, 144], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [243, 244, 246] },
          margin: { top: 30 }
        });

        doc.save(`verifications_report_${new Date().toISOString().slice(0, 10)}.pdf`);
        toast.success('Verifications exported to PDF successfully');
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    fetchAllVerifications();
  }, []);

  const fetchAllVerifications = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/verification/all', {
        credentials: 'include'
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:5001/api/verification/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          rejectionReason: status === 'rejected' ? rejectionReason : undefined
        })
      });

      if (response.ok) {
        fetchAllVerifications();
        setSelectedUser(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
            <CheckCircle size={16} />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
            <XCircle size={16} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">
            <Clock size={16} />
            Pending
          </span>
        );
    }
  };

  const pendingUsers = users.filter(user => user.verificationStatus === 'pending');
  const processedUsers = users.filter(user => ['verified', 'rejected'].includes(user.verificationStatus));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full"
          style={{ filter: "blur(80px)", transform: "translate(30%, -30%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full"
          style={{ filter: "blur(80px)", transform: "translate(-30%, 30%)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Add Back to Dashboard link */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/admin/dashboard"
              className="flex items-center text-blue-300 hover:text-blue-100 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Link>
          </motion.div>
        </motion.div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">ID Verification Management</h2>
            <p className="text-blue-300 mt-2">Review and process verification requests</p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-lg">
            <Clock size={20} />
            <span>{pendingUsers.length} Pending Requests</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Pending Verifications Section */}
              <div className="bg-blue-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-blue-500/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Pending Verifications</h3>
                  <span className="text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full text-sm">
                    {pendingUsers.length} requests
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingUsers.map(user => (
                    <motion.div
                      key={user._id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedUser?._id === user._id 
                          ? 'bg-blue-600/30 border border-blue-400/30' 
                          : 'bg-blue-900/30 border border-blue-500/20 hover:bg-blue-700/30'
                      }`}
                      onClick={() => setSelectedUser(user)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{user.prenom} {user.nom}</p>
                          <p className="text-sm text-blue-300">{user.email}</p>
                        </div>
                        {getStatusBadge(user.verificationStatus)}
                      </div>
                    </motion.div>
                  ))}
                  {pendingUsers.length === 0 && (
                    <p className="text-blue-300 text-center py-4">No pending verifications</p>
                  )}
                </div>
              </div>

              {/* Processed Verifications Section */}
              <div className="bg-blue-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-blue-500/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Processed Verifications</h3>
                  <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-sm">
                    {processedUsers.length} total
                  </span>
                </div>
                <div className="space-y-4">
                  {processedUsers.map(user => (
                    <motion.div
                      key={user._id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedUser?._id === user._id 
                          ? 'bg-blue-600/30 border border-blue-400/30' 
                          : 'bg-blue-900/30 border border-blue-500/20 hover:bg-blue-700/30'
                      }`}
                      onClick={() => setSelectedUser(user)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{user.prenom} {user.nom}</p>
                          <p className="text-sm text-blue-300">{user.email}</p>
                        </div>
                        {getStatusBadge(user.verificationStatus)}
                      </div>
                    </motion.div>
                  ))}
                  {processedUsers.length === 0 && (
                    <p className="text-blue-300 text-center py-4">No processed verifications</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Verification Details */}
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-blue-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-blue-500/20 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Verification Details</h3>
                    <p className="text-sm text-blue-300 mt-1">
                      Submitted by {selectedUser.prenom} {selectedUser.nom}
                    </p>
                  </div>
                  {getStatusBadge(selectedUser.verificationStatus)}
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-blue-200 mb-2">Front ID Document</h4>
                      <img 
                        src={selectedUser.documents.front} 
                        alt="Front ID" 
                        className="w-full rounded-lg border border-blue-500/20"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-200 mb-2">Back ID Document</h4>
                      <img 
                        src={selectedUser.documents.back} 
                        alt="Back ID" 
                        className="w-full rounded-lg border border-blue-500/20"
                      />
                    </div>
                  </div>

                  {selectedUser.verificationStatus === 'pending' ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="rejectionReason" className="block text-blue-200">
                          Rejection Reason (required if rejecting)
                        </label>
                        <textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full bg-blue-900/30 border border-blue-500/20 rounded-lg p-3 text-white"
                          rows="3"
                          placeholder="Enter reason for rejection..."
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 rounded-lg flex items-center justify-center gap-2"
                          onClick={() => handleVerification(selectedUser._id, 'verified')}
                        >
                          <Check size={20} />
                          Approve
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded-lg flex items-center justify-center gap-2"
                          onClick={() => {
                            if (!rejectionReason.trim()) {
                              alert('Please provide a rejection reason');
                              return;
                            }
                            handleVerification(selectedUser._id, 'rejected');
                          }}
                        >
                          <X size={20} />
                          Reject
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4 rounded-lg bg-blue-900/30 border border-blue-500/20">
                      <p className="text-blue-200">
                        <strong>Processed Date:</strong>{' '}
                        {new Date(selectedUser.verificationDate).toLocaleDateString()}
                      </p>
                      <p className="text-blue-200">
                        <strong>Status:</strong>{' '}
                        {selectedUser.verificationStatus.charAt(0).toUpperCase() + 
                         selectedUser.verificationStatus.slice(1)}
                      </p>
                      {selectedUser.rejectionReason && (
                        <p className="text-blue-200">
                          <strong>Rejection Reason:</strong> {selectedUser.rejectionReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationManager;
