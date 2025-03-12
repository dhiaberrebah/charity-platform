import mongoose from "mongoose"

const donationSchema = new mongoose.Schema(
  {
    cause: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cause",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    donor: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: String,
      address: String,
      city: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer"],
      default: "card",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    message: String,
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentDetails: {
      last4: String,
      cardName: String,
    },
    transactionId: String,
  },
  { timestamps: true },
)

const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema)

export default Donation

