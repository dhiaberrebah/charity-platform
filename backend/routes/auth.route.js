import express from "express"
import { login, logout, signup, checkAuth, updateUser, getUsers, deleteUser, getVerificationStatus, changePassword } from "../controllers/auth.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"
const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/get", protectRoute, getUsers)
router.post("/logout", logout)
router.get("/check", protectRoute, checkAuth)
router.put("/users/:id", protectRoute, updateUser)
router.delete("/users/:id", protectRoute, adminRoute, deleteUser)
router.get('/verification-status', protectRoute, getVerificationStatus)
router.post("/change-password", protectRoute, changePassword)

export default router

