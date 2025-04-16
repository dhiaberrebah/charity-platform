import express from "express"
import { createComment, getCauseComments } from "../controllers/comment.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// POST /api/comments - Create a new comment
router.post("/", protectRoute, createComment)

// GET /api/comments/cause/:causeId - Get comments for a cause
router.get("/cause/:causeId", getCauseComments)

export default router
