import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import causeRoutes from "./routes/cause.route.js"
import dashboardRoutes from "./routes/dashboard.route.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import multer from "multer"
import commentRoutes from "./routes/comment.route.js"
// Import the donations route using ES modules syntax
import donationsRoutes from "./routes/donations.js"
// Add this import at the top with your other route imports
import notificationRoutes from "./routes/notification.route.js"
import verificationRoutes from './routes/verification.route.js';
import documentsRoutes from './routes/documents.js';
import aiRoutes from './routes/ai.route.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const PORT = process.env.PORT || 5001
app.use(express.json()) // Parses JSON request body
app.use(express.urlencoded({ extended: true })) // Parses form data
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173", // This matches your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack)
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
})

// Add a simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" })
})

// Add a test route for donations
app.get("/api/donations/test", (req, res) => {
  console.log("Donations test route hit directly from server.js")
  res.json({ message: "Donations test API is working directly from server.js!" })
})

// Add this line to debug API requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Then keep your existing routes
app.use("/api/donations", donationsRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/causes", causeRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/notifications", notificationRoutes)
app.use('/api/verification', verificationRoutes);
app.use('/api/documents', documentsRoutes);
app.use("/api/comments", commentRoutes)
app.use('/api/ai', aiRoutes);

// Make sure your multer configuration is saving files to this directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/"))
  },
  filename: (req, file, cb) => {
    cb(null, "image-" + Date.now() + path.extname(file.originalname))
  },
})

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
  connectDB()
})

