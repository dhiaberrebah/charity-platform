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

const router = express.Router()

// Public routes
router.get("/public/:shareUrl", getShareableCause)

// Protected routes
router.post("/", protectRoute, createCause)
router.get("/", protectRoute, getCauses)
router.get("/user", protectRoute, getUserCauses)
router.get("/:id", protectRoute, getCause)
router.put("/:id", protectRoute, updateCause)
router.delete("/:id", protectRoute, adminRoute, deleteCause)

export default router

