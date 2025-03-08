import express from "express"
import {
  createCause,
  getCauses,
  getUserCauses,
  getCause,
  updateCause,
  deleteCause,
} from "../controllers/cause.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/", protectRoute, createCause)
router.get("/", getCauses)
router.get("/user", protectRoute, getUserCauses)
router.get("/:id", protectRoute, getCause)
router.put("/:id", protectRoute, updateCause)
router.delete("/:id", protectRoute, deleteCause)

export default router

