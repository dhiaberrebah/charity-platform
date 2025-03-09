"use client"

import { useState } from "react"
import { X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

const CauseDetails = ({ cause, onClose, isAdmin, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCause, setEditedCause] = useState(cause)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedCause((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setEditedCause((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onEdit(editedCause)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating cause:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-200"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-blue-900">Détails de la Cha9a9a</h2>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-blue-800">
                  Titre
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={editedCause.title}
                  onChange={handleChange}
                  className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-blue-800">
                  Catégorie
                </Label>
                <Select onValueChange={(value) => handleSelectChange("category", value)} value={editedCause.category}>
                  <SelectTrigger id="category" className="bg-blue-50/50 border-blue-200">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-blue-100">
                    <SelectItem value="medical" className="text-blue-800 hover:bg-blue-50">
                      Médical
                    </SelectItem>
                    <SelectItem value="education" className="text-blue-800 hover:bg-blue-50">
                      Éducation
                    </SelectItem>
                    <SelectItem value="emergency" className="text-blue-800 hover:bg-blue-50">
                      Urgence
                    </SelectItem>
                    <SelectItem value="community" className="text-blue-800 hover:bg-blue-50">
                      Communauté
                    </SelectItem>
                    <SelectItem value="other" className="text-blue-800 hover:bg-blue-50">
                      Autre
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetAmount" className="text-blue-800">
                  Montant cible (DH)
                </Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  value={editedCause.targetAmount}
                  onChange={handleChange}
                  className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-blue-800">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedCause.description}
                  onChange={handleChange}
                  rows={5}
                  className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              {isAdmin && (
                <div>
                  <Label htmlFor="status" className="text-blue-800">
                    Statut
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("status", value)} value={editedCause.status}>
                    <SelectTrigger id="status" className="bg-blue-50/50 border-blue-200">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-blue-100">
                      <SelectItem value="pending" className="text-blue-800 hover:bg-blue-50">
                        En attente
                      </SelectItem>
                      <SelectItem value="approved" className="text-blue-800 hover:bg-blue-50">
                        Approuvé
                      </SelectItem>
                      <SelectItem value="rejected" className="text-blue-800 hover:bg-blue-50">
                        Rejeté
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    Annuler
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Sauvegarder
                  </Button>
                </motion.div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-blue-800">
                <strong className="text-blue-900">Titre:</strong> {cause.title}
              </p>
              <p className="text-blue-800">
                <strong className="text-blue-900">Catégorie:</strong> {cause.category}
              </p>
              <p className="text-blue-800">
                <strong className="text-blue-900">Montant cible:</strong> {cause.targetAmount} DH
              </p>
              <p className="text-blue-800">
                <strong className="text-blue-900">Description:</strong> {cause.description}
              </p>
              <p className="text-blue-800">
                <strong className="text-blue-900">Statut:</strong> {cause.status}
              </p>
              <p className="text-blue-800">
                <strong className="text-blue-900">Montant actuel:</strong> {cause.currentAmount} DH
              </p>
              {cause.image && (
                <div>
                  <strong className="text-blue-900">Image:</strong>
                  <img
                    src={cause.image || "/placeholder.svg"}
                    alt={cause.title}
                    className="mt-2 max-w-full h-auto rounded-lg border border-blue-200"
                  />
                </div>
              )}
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default CauseDetails

