import express from "express"
import {
  login,
  logout,
  signup,
  checkAuth,
  updateProfile,
  getUsers,
  deleteUser,
} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/get", getUsers)
router.post("/logout", logout)
router.get("/check", protectRoute, checkAuth)
router.put("/profile", protectRoute, updateProfile)
router.delete("/users/:id", protectRoute, deleteUser) // Add this new route

export default router

