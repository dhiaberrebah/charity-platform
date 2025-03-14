import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["user", "cause", "donation"],
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification

