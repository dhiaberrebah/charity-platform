"use client"

import { useState, useCallback, useRef } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { motion } from "framer-motion"

const CreateCauseForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    targetAmount: "",
    description: "",
    image: null,
    acceptTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const submissionIdRef = useRef(Date.now().toString())
  const hasSubmittedRef = useRef(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Le titre est requis"
    if (!formData.category) newErrors.category = "La catégorie est requise"
    if (!formData.targetAmount || isNaN(formData.targetAmount)) newErrors.targetAmount = "Montant invalide"
    if (!formData.description.trim()) newErrors.description = "La description est requise"
    if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      if (!validateForm() || isSubmitting || hasSubmittedRef.current) return

      setIsSubmitting(true)

      try {
        const formDataToSend = new FormData()
        formDataToSend.append("title", formData.title)
        formDataToSend.append("description", formData.description)
        formDataToSend.append("category", formData.category)
        formDataToSend.append("targetAmount", formData.targetAmount)
        if (formData.image) {
          formDataToSend.append("image", formData.image, formData.image.name)
        }
        formDataToSend.append("submissionId", submissionIdRef.current)

        hasSubmittedRef.current = true
        onSubmit(formDataToSend)
        onClose()
      } catch (error) {
        console.error("Error preparing form data:", error)
        toast.error("Une erreur s'est produite lors de la préparation des données.")
        setErrors((prev) => ({ ...prev, submit: error.message }))
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, isSubmitting, onSubmit, onClose],
  )

  return (
    <div className="fixed inset-0 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-200"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-blue-900">Créer une Cha9a9a</h2>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-blue-500 hover:text-blue-700 hover:bg-blue-100">
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-blue-800">Titre de votre Cha9a9a</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="category" className="text-blue-800">Catégorie</Label>
              <Select onValueChange={(value) => handleSelectChange("category", value)} value={formData.category}>
                <SelectTrigger id="category" className={`bg-blue-50/50 border-blue-200 ${errors.category ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-blue-100">
                  <SelectItem value="medical" className="text-blue-800 hover:bg-blue-50">Médical</SelectItem>
                  <SelectItem value="education" className="text-blue-800 hover:bg-blue-50">Éducation</SelectItem>
                  <SelectItem value="emergency" className="text-blue-800 hover:bg-blue-50">Urgence</SelectItem>
                  <SelectItem value="community" className="text-blue-800 hover:bg-blue-50">Communauté</SelectItem>
                  <SelectItem value="other" className="text-blue-800 hover:bg-blue-50">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <Label htmlFor="targetAmount" className="text-blue-800">Montant cible (DH)</Label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={handleChange}
                className={`bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${errors.targetAmount ? "border-red-500" : ""}`}
              />
              {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
            </div>

            <div>
              <Label htmlFor="description" className="text-blue-800">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="image" className="text-blue-800">Image (optionnel)</Label>
              <Input 
                id="image" 
                name="image" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    acceptTerms: checked,
                  }))
                }}
                className="text-blue-500 border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <label
                htmlFor="acceptTerms"
                className={`text-sm ${errors.acceptTerms ? "text-red-500" : "text-blue-700"}`}
              >
                J'accepte les conditions générales et je certifie que toutes les informations fournies sont exactes
              </label>
            </div>
            {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}

            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-blue-100">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Annuler
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isSubmitting || hasSubmittedRef.current}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSubmitting ? "Création en cours..." : "Créer ma Cha9a9a"}
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateCauseForm