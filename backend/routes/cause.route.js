import express from "express"
import {
  createCause,
  getCauses,
  getUserCauses,
  getCause,
  updateCause,
  deleteCause,
  getShareableCause, // Add the new function
} from "../controllers/cause.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/", protectRoute, createCause)
router.get("/", getCauses)
router.get("/user", protectRoute, getUserCauses)
router.get("/:id", getCause)
router.put("/:id", protectRoute, updateCause)
router.delete("/:id", protectRoute, adminRoute, deleteCause)
router.get("/share/:shareUrl", getShareableCause) // Add new route for shareable links

export default router

