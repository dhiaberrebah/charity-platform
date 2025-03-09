"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import CreateCauseForm from "@/components/CreateCauseForm"
import CauseDetails from "@/components/CauseDetails"
import { toast } from "sonner"
import { motion } from "framer-motion"

const MyCauses = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [causes, setCauses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCause, setSelectedCause] = useState(null)

  const fetchCauses = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5001/api/causes/user", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Fetched user causes:", data)
      setCauses(data)
    } catch (error) {
      console.error("Error fetching causes:", error)
      toast.error("Failed to load causes: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCauses()
  }, [fetchCauses])

  const handleCreateCause = () => {
    setShowCreateForm(true)
  }

  const handleCloseForm = () => {
    setShowCreateForm(false)
  }

  const handleSubmitForm = useCallback(
    async (formData) => {
      try {
        const response = await fetch("http://localhost:5001/api/causes", {
          method: "POST",
          body: formData,
          credentials: "include",
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to create cause")
        }

        await fetchCauses()
        toast.success("Votre Cha9a9a a été créée avec succès!")
        setShowCreateForm(false)
      } catch (error) {
        console.error("Error creating cause:", error)
        if (error.message.includes("duplicate key error")) {
          toast.error("Une Cha9a9a avec ce titre existe déjà.")
        } else {
          toast.error("Failed to create cause: " + error.message)
        }
      }
    },
    [fetchCauses],
  )

  const handleViewDetails = (cause) => {
    setSelectedCause(cause)
  }

  const handleCloseDetails = () => {
    setSelectedCause(null)
  }

  const handleEditCause = async (editedCause) => {
    try {
      const response = await fetch(`http://localhost:5001/api/causes/${editedCause._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCause),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to update cause")
      }

      await fetchCauses()
      toast.success("Cause updated successfully")
      setSelectedCause(null)
    } catch (error) {
      console.error("Error updating cause:", error)
      toast.error("Failed to update cause: " + error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm p-6 rounded-lg shadow border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">My Causes</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={handleCreateCause} 
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Create New Cause
          </Button>
        </motion.div>
      </div>

      {causes.length > 0 ? (
        <div className="grid gap-4">
          {causes.map((cause, index) => (
            <motion.div 
              key={cause._id} 
              className="border border-blue-200 bg-white/50 rounded-lg p-4 flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)" }}
            >
              <div>
                <h3 className="font-semibold text-blue-900">{cause.title}</h3>
                <p className="text-sm text-blue-700">
                  Objectif: {cause.targetAmount} DH • Statut: {cause.status === "pending" ? "En attente" : cause.status}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="text-blue-500 border-blue-500 hover:bg-blue-500/10"
                  onClick={() => handleViewDetails(cause)}
                >
                  Voir détails
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-12 border-2 border-dashed border-blue-200 rounded-lg bg-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Heart className="w-12 h-12 mx-auto text-blue-400 mb-4" />
          </motion.div>
          <p className="text-blue-800 mb-2">You haven't created any causes yet</p>
          <p className="text-sm text-blue-600 mb-4">Create your first cause to start collecting donations</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleCreateCause} 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8"
            >
              Create New Cause
            </Button>
          </motion.div>
        </motion.div>
      )}

      {showCreateForm && <CreateCauseForm onClose={handleCloseForm} onSubmit={handleSubmitForm} />}
      {selectedCause && (
        <CauseDetails cause={selectedCause} onClose={handleCloseDetails} isAdmin={false} onEdit={handleEditCause} />
      )}
    </motion.div>
  )
}

export default MyCauses