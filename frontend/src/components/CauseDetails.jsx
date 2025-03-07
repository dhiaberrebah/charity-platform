"use client"

import { useState } from "react"
import { X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Détails de la Cha9a9a</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" name="title" value={editedCause.title} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select onValueChange={(value) => handleSelectChange("category", value)} value={editedCause.category}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Médical</SelectItem>
                    <SelectItem value="education">Éducation</SelectItem>
                    <SelectItem value="emergency">Urgence</SelectItem>
                    <SelectItem value="community">Communauté</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetAmount">Montant cible (DH)</Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  value={editedCause.targetAmount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedCause.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              {isAdmin && (
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select onValueChange={(value) => handleSelectChange("status", value)} value={editedCause.status}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="approved">Approuvé</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button type="submit">Sauvegarder</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p>
                <strong>Titre:</strong> {cause.title}
              </p>
              <p>
                <strong>Catégorie:</strong> {cause.category}
              </p>
              <p>
                <strong>Montant cible:</strong> {cause.targetAmount} DH
              </p>
              <p>
                <strong>Description:</strong> {cause.description}
              </p>
              <p>
                <strong>Statut:</strong> {cause.status}
              </p>
              <p>
                <strong>Montant actuel:</strong> {cause.currentAmount} DH
              </p>
              {cause.image && (
                <div>
                  <strong>Image:</strong>
                  <img src={cause.image || "/placeholder.svg"} alt={cause.title} className="mt-2 max-w-full h-auto" />
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CauseDetails

