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

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack)
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Add a simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" })
})

app.use("/api/auth", authRoutes)
app.use("/api/causes", causeRoutes)
app.use("/api/dashboard", dashboardRoutes)

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
  connectDB()
})

