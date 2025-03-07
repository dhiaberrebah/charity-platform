"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import CreateCauseForm from "@/components/CreateCauseForm"
import CauseDetails from "@/components/CauseDetails"
import { toast } from "sonner"

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
    return <div>Loading...</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Causes</h2>
        <Button onClick={handleCreateCause} className="bg-[#65A89D] hover:bg-[#558b82] text-white">
          Create New Cause
        </Button>
      </div>

      {causes.length > 0 ? (
        <div className="grid gap-4">
          {causes.map((cause) => (
            <div key={cause._id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{cause.title}</h3>
                <p className="text-sm text-gray-500">
                  Objectif: {cause.targetAmount} DH • Statut: {cause.status === "pending" ? "En attente" : cause.status}
                </p>
              </div>
              <Button
                variant="outline"
                className="text-[#65A89D] border-[#65A89D] hover:bg-[#65A89D]/10"
                onClick={() => handleViewDetails(cause)}
              >
                Voir détails
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">You haven't created any causes yet</p>
          <p className="text-sm text-gray-500 mb-4">Create your first cause to start collecting donations</p>
          <Button onClick={handleCreateCause} className="bg-[#65A89D] hover:bg-[#558b82] text-white rounded-full px-8">
            Lancez-vous ! Créez votre Cha9a9a
          </Button>
        </div>
      )}

      {showCreateForm && <CreateCauseForm onClose={handleCloseForm} onSubmit={handleSubmitForm} />}
      {selectedCause && (
        <CauseDetails cause={selectedCause} onClose={handleCloseDetails} isAdmin={false} onEdit={handleEditCause} />
      )}
    </div>
  )
}

export default MyCauses

