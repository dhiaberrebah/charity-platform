import express from "express"
import {
  createCause,
  getCauses,
  getCause,
  getUserCauses,
  updateCause,
  deleteCause,
  getShareableCause,
} from "../controllers/cause.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"
import mongoose from 'mongoose';
import Cause from '../models/cause.model.js';
import Donation from '../models/Donation.js';

const router = express.Router()

// Public routes
router.get("/public/:shareUrl", getShareableCause)

// Protected routes
router.post("/", protectRoute, createCause)
router.get("/", getCauses)
router.get("/user", protectRoute, getUserCauses)
router.get("/:id", getCause)
router.put("/:id", protectRoute, updateCause)
router.delete("/:id", protectRoute, adminRoute, deleteCause)

// Progress route
router.get('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cause ID format',
        details: `Expected 24 character hex string, got: ${id}`
      });
    }

    // Calculate total donations for this cause
    const totalDonations = await Donation.aggregate([
      { $match: { cause: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get cause details
    const cause = await Cause.findById(id).select('targetAmount').lean();
    
    if (!cause) {
      return res.status(404).json({
        success: false,
        message: 'Cause not found',
        details: `No cause found with ID: ${id}`
      });
    }
    
    // Calculate current amount from donations
    const currentAmount = totalDonations[0]?.total || 0;
    const targetAmount = Number(cause.targetAmount || 0);
    const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

    // Log the values for debugging
    console.log('Progress calculation:', {
      currentAmount,
      targetAmount,
      progress,
      totalDonations,
      causeId: id
    });

    res.json({
      success: true,
      currentAmount,
      targetAmount,
      progress
    });
  } catch (error) {
    console.error('Error fetching cause progress:', {
      causeId: req.params.id,
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch cause progress',
      error: error.message
    });
  }
});

export default router

