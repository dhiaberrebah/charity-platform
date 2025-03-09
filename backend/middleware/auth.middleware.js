import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Error in protectRoute middleware:", error)
    res.status(401).json({ message: "Not authorized, invalid token" })
  }
}

export const adminRoute = async (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next()
  } else {
    res.status(403).json({ message: "Not authorized as an admin" })
  }
}
