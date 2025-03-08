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

router.post("/", createCause)
router.get("/", getCauses)
router.get("/user", getUserCauses)
router.get("/:id", getCause)
router.put("/:id", updateCause)
router.delete("/:id", deleteCause)

export default router

