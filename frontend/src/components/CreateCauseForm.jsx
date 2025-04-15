"use client"

import { useState, useCallback, useRef } from "react"
import { X, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { AnimatePresence, motion } from "framer-motion"

const CreateCauseForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    targetAmount: "",
    description: "",
    image: null,
    acceptTerms: false,
    customShareUrl: "",
    RIB: "", // Add this line
  })
  const [imagePreview, setImagePreview] = useState(null) // Add this line
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
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, or GIF)')
        return
      }

      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 10MB')
        // Reset the input
        e.target.value = ''
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      setFormData(prev => ({
        ...prev,
        image: file
      }))
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData(prev => ({
      ...prev,
      image: null
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Le titre est requis"
    if (!formData.category) newErrors.category = "La catégorie est requise"
    if (!formData.targetAmount || isNaN(formData.targetAmount) || formData.targetAmount <= 0) {
      newErrors.targetAmount = "Montant invalide"
    }
    if (!formData.description.trim()) newErrors.description = "La description est requise"
    if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions"

    // Removed image validation since it's now optional

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add all required fields
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("targetAmount", formData.targetAmount);
      formDataToSend.append("RIB", formData.RIB.trim());

      // Only append image if one was selected (now optional)
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      await onSubmit(formDataToSend);
      
      // The form will be closed by the parent component after successful submission
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }));
      toast.error(error.message || "Failed to create cause");
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-sm" 
             onClick={onClose} />

        {/* Modal Container */}
        <div className="fixed inset-0 flex items-start justify-center pt-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-blue-500/20 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border-b border-blue-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Créer une Nouvelle Cause</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-800/50 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-blue-200" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Section */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-blue-100">Titre de la Cause</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`bg-blue-900/20 border-blue-500/30 text-white placeholder-blue-300/50 focus:border-blue-400 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    placeholder="Entrez le titre de votre cause"
                  />
                  {errors.title && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.title}</span>
                    </div>
                  )}
                </div>

                {/* Category and Target Amount Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-blue-100">Catégorie</Label>
                    <Select onValueChange={(value) => handleSelectChange("category", value)} value={formData.category}>
                      <SelectTrigger
                        id="category"
                        className={`bg-blue-900/20 border-blue-500/30 text-white ${
                          errors.category ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-800 border border-blue-500/20">
                        <SelectItem value="medical" className="text-blue-100 hover:bg-blue-700/50">Médical</SelectItem>
                        <SelectItem value="education" className="text-blue-100 hover:bg-blue-700/50">Éducation</SelectItem>
                        <SelectItem value="emergency" className="text-blue-100 hover:bg-blue-700/50">Urgence</SelectItem>
                        <SelectItem value="community" className="text-blue-100 hover:bg-blue-700/50">Communauté</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.category}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAmount" className="text-blue-100">Montant Cible (DH)</Label>
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      className={`bg-blue-900/20 border-blue-500/30 text-white placeholder-blue-300/50 ${
                        errors.targetAmount ? "border-red-500" : ""
                      }`}
                      placeholder="0.00"
                    />
                    {errors.targetAmount && (
                      <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.targetAmount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-blue-100">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`min-h-[120px] bg-blue-900/20 border-blue-500/30 text-white placeholder-blue-300/50 ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    placeholder="Décrivez votre cause..."
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.description}</span>
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-blue-100">Image</Label>
                  <div className="mt-1 flex flex-col items-center space-y-4">
                    {imagePreview ? (
                      <div className="relative w-full max-w-md">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-blue-500/30"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500/80 text-white p-2 rounded-full hover:bg-red-600/80 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-full flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-blue-500/30 border-dashed rounded-lg bg-blue-900/20 cursor-pointer hover:bg-blue-900/30 transition-colors"
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-blue-300" />
                          <div className="flex text-sm text-blue-200">
                            <label className="relative cursor-pointer rounded-md font-medium text-blue-300 hover:text-blue-200">
                              <span>Upload a file</span>
                              <input
                                id="image-upload"
                                name="image"
                                type="file"
                                className="sr-only"
                                onChange={handleImageChange}
                                accept="image/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-blue-300">PNG, JPG, GIF (Max 10MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIB (Relevé d'Identité Bancaire) */}
                <div className="space-y-2">
                  <Label htmlFor="RIB" className="text-blue-100">RIB (Relevé d'Identité Bancaire)</Label>
                  <Input
                    id="RIB"
                    name="RIB"
                    value={formData.RIB}
                    onChange={handleChange}
                    className="bg-blue-900/20 border-blue-500/30 text-white placeholder-blue-300/50"
                    placeholder="Entrez votre RIB"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <Separator className="bg-blue-500/20" />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        handleChange({
                          target: { name: "acceptTerms", type: "checkbox", checked },
                        })
                      }
                      className="border-blue-500/30 data-[state=checked]:bg-blue-500"
                    />
                    <Label
                      htmlFor="acceptTerms"
                      className="text-sm text-blue-200"
                    >
                      J'accepte les termes et conditions
                    </Label>
                  </div>
                  {errors.acceptTerms && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.acceptTerms}</span>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-blue-500/30 text-blue-200 hover:bg-blue-800/30"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isSubmitting ? "Création..." : "Créer la Cause"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default CreateCauseForm

