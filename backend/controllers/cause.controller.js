import Cause from "../models/cause.model.js"
import multer from "multer"
import path from "path"
import fs from "fs"

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads")
    fs.mkdirSync(uploadPath, { recursive: true })
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage }).single("image")

// Keep track of processed submissions
const processedSubmissions = new Set()

export const createCause = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "Error uploading file: " + err.message })
    } else if (err) {
      return res.status(500).json({ message: "Unknown error: " + err.message })
    }

    const submissionId = req.body.submissionId

    // Check if this submission has already been processed
    if (processedSubmissions.has(submissionId)) {
      return res.status(400).json({ message: "This submission has already been processed" })
    }

    try {
      const { title, description, category, targetAmount } = req.body

      // Check if a cause with the same title already exists for this user
      const existingCause = await Cause.findOne({ title, createdBy: req.user._id })
      if (existingCause) {
        if (req.file) {
          fs.unlink(req.file.path, (unlinkError) => {
            if (unlinkError) {
              console.error("Error deleting file:", unlinkError)
            }
          })
        }
        return res.status(400).json({ message: "A cause with this title already exists" })
      }

      const newCause = new Cause({
        title,
        description,
        category,
        targetAmount,
        image: req.file ? req.file.path : undefined,
        createdBy: req.user._id,
      })
      await newCause.save()

      // Mark this submission as processed
      processedSubmissions.add(submissionId)

      // Clean up old submission IDs (optional, prevents unlimited growth of the Set)
      if (processedSubmissions.size > 1000) {
        const oldestSubmission = processedSubmissions.values().next().value
        processedSubmissions.delete(oldestSubmission)
      }

      res.status(201).json(newCause)
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkError) => {
          if (unlinkError) {
            console.error("Error deleting file:", unlinkError)
          }
        })
      }
      res.status(400).json({ message: error.message })
    }
  })
}

export const getCauses = async (req, res) => {
  try {
    const causes = await Cause.find().populate("createdBy", "nom prenom")
    console.log("Sending causes:", causes.length)
    res.json(causes)
  } catch (error) {
    console.error("Error in getCauses:", error)
    res.status(500).json({ message: error.message })
  }
}

export const getCause = async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id).populate("createdBy", "nom prenom")
    if (!cause) {
      return res.status(404).json({ message: "Cause not found" })
    }
    res.json(cause)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getUserCauses = async (req, res) => {
  try {
    const causes = await Cause.find({ createdBy: req.user._id }).populate("createdBy", "nom prenom")
    console.log(`Sending ${causes.length} causes for user ${req.user._id}`)
    res.json(causes)
  } catch (error) {
    console.error("Error in getUserCauses:", error)
    res.status(500).json({ message: error.message })
  }
}

export const updateCause = async (req, res) => {
  try {
    const { title, description, category, targetAmount, status } = req.body
    const causeId = req.params.id

    console.log("Updating cause:", causeId)
    console.log("Request body:", req.body)

    const cause = await Cause.findById(causeId)

    if (!cause) {
      return res.status(404).json({ message: "Cause not found" })
    }

    if (title) cause.title = title
    if (description) cause.description = description
    if (category) cause.category = category
    if (targetAmount) cause.targetAmount = targetAmount
    if (status) cause.status = status

    const updatedCause = await cause.save()
    console.log("Updated cause:", updatedCause)
    res.json(updatedCause)
  } catch (error) {
    console.error("Error in updateCause:", error)
    res.status(400).json({ message: error.message })
  }
}

export const deleteCause = async (req, res) => {
  try {
    const deletedCause = await Cause.findByIdAndDelete(req.params.id)
    if (!deletedCause) {
      return res.status(404).json({ message: "Cause not found" })
    }
    res.json({ message: "Cause deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}