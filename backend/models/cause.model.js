import mongoose from "mongoose"

const causeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
      set: v => Number(v)  // Ensure it's always stored as a number
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    image: {
      type: String,
      required: false, // Make it optional
    },
    shareUrl: {
      type: String,
      default: "", // New field for sharing URL
    },
    RIB: {
      type: String,
      default: "", // New field for RIB
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },  // Apply getters when converting to JSON
    toObject: { getters: true }
  }
)

// Generate a unique share URL when saving a new cause
causeSchema.pre("save", function (next) {
  // Only generate shareUrl if it doesn't exist yet
  if (!this.shareUrl && this._id) {
    // Create a unique, SEO-friendly URL based on title and ID
    const titleSlug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 50) // Limit length

    this.shareUrl = `${titleSlug}-${this._id}`
  }
  next()
})

// Add a pre-save middleware to ensure currentAmount is a number
causeSchema.pre('save', function(next) {
  if (this.currentAmount) {
    this.currentAmount = Number(this.currentAmount);
  }
  next();
});

const Cause = mongoose.model("Cause", causeSchema)
export default Cause

