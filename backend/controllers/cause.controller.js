import Cause from "../models/cause.model.js"
import multer from "multer"
import path from "path"
import fs from "fs"
import { createNotification } from "./notification.controller.js"
import { uploadToCloudinary } from '../config/cloudinary.js';

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

// Make sure to export all functions
export const createCause = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "Error uploading file: " + err.message });
    } else if (err) {
      return res.status(500).json({ message: "Unknown error: " + err.message });
    }

    const submissionId = req.body.submissionId;
    if (processedSubmissions.has(submissionId)) {
      return res.status(400).json({ message: "This submission has already been processed" });
    }

    try {
      const { title, description, category, targetAmount, RIB } = req.body;
      let imageUrl;

      if (req.file) {
        try {
          imageUrl = await uploadToCloudinary(req.file);
          // Clean up the temporary file after successful upload
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temporary file:', err);
          });
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ message: 'Error uploading image' });
        }
      }

      const newCause = new Cause({
        title,
        description,
        category,
        targetAmount,
        image: imageUrl,
        createdBy: req.user._id,
        RIB,
      });

      await newCause.save();
      processedSubmissions.add(submissionId);

      // Clean up old submission IDs
      if (processedSubmissions.size > 1000) {
        const oldestSubmission = processedSubmissions.values().next().value;
        processedSubmissions.delete(oldestSubmission);
      }

      res.status(201).json(newCause);
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temporary file:', err);
        });
      }
      res.status(400).json({ message: error.message });
    }
  });
}

export const getCauses = async (req, res) => {
  try {
    const causes = await Cause.find().populate("createdBy", "nom prenom");
    
    // Ensure each cause has a shareUrl
    const causesWithShareUrl = causes.map(cause => {
      const causeObj = cause.toObject();
      causeObj.shareUrl = cause.shareUrl || `${cause.title.toLowerCase().replace(/\s+/g, '-')}-${cause._id}`;
      return causeObj;
    });

    res.json(causesWithShareUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const getShareableCause = async (req, res) => {
  try {
    const shareUrl = req.params.shareUrl;

    // Extract the ID from the shareUrl (it's the part after the last dash)
    const parts = shareUrl.split("-");
    const causeId = parts[parts.length - 1];

    // Find the cause by ID
    const cause = await Cause.findById(causeId).populate("createdBy", "nom prenom");

    if (!cause) {
      return res.status(404).json({ message: "Cause not found" });
    }

    // Only return approved causes for public sharing
    if (cause.status !== "approved") {
      return res.status(403).json({ message: "This cause is not available for public viewing" });
    }

    // Ensure the cause has a shareUrl
    cause.shareUrl = cause.shareUrl || `${cause.title.toLowerCase().replace(/\s+/g, '-')}-${cause._id}`;

    res.json(cause);
  } catch (error) {
    console.error("Error in getShareableCause:", error);
    res.status(500).json({ message: error.message });
  }
};
