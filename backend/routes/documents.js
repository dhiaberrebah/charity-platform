import express from 'express';
import { uploadDocuments } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route for uploading documents
router.post('/upload', 
  protectRoute, 
  upload.fields([
    { name: 'frontDocument', maxCount: 1 },
    { name: 'backDocument', maxCount: 1 }
  ]),
  uploadDocuments
);

export default router;