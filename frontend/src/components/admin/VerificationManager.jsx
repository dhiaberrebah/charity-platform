import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const VerificationManager = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/verification/pending', {
        credentials: 'include'
      });
      const data = await response.json();
      setPendingUsers(data);
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
        fetchPendingVerifications();
        setSelectedUser(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">ID Verification Management</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Users List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Pending Verifications</h3>
            {pendingUsers.map(user => (
              <motion.div
                key={user._id}
                className="border-b p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedUser(user)}
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">{user.prenom} {user.nom}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </motion.div>
            ))}
          </div>

          {/* Verification Details */}
          {selectedUser && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Verification Details</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Front ID Document</h4>
                  <img 
                    src={selectedUser.documents.front} 
                    alt="Front ID" 
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                </div>

                <div>
                  <h4 className="font-medium">Back ID Document</h4>
                  <img 
                    src={selectedUser.documents.back} 
                    alt="Back ID" 
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  {/* Rejection reason input */}
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Reason for rejection (if applicable)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleVerification(selectedUser._id, 'verified')}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleVerification(selectedUser._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationManager;