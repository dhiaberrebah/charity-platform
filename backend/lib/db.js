import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/charity-platform"

    console.log("Connecting to MongoDB...")
    console.log("Connection string:", MONGODB_URI)

    await mongoose.connect(MONGODB_URI)

    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

