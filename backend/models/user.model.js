import mongoose from "mongoose"

const userSchema = mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    adresse: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    documents: {
      front: { type: String },
      back: { type: String }
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verificationDate: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String
  },
  {
    timestamps: true,
  },
)

// Add a pre-save hook to sync isAdmin with role
userSchema.pre("save", function (next) {
  // Sync isAdmin boolean with role field
  if (this.role === "admin" && !this.isAdmin) {
    this.isAdmin = true
  } else if (this.role === "user" && this.isAdmin) {
    this.isAdmin = false
  }

  // If isAdmin is changed, sync role field
  if (this.isAdmin && this.role !== "admin") {
    this.role = "admin"
  } else if (!this.isAdmin && this.role !== "user") {
    this.role = "user"
  }

  next()
})

const User = mongoose.model("User", userSchema)

export default User

