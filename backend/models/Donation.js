import mongoose from "mongoose"

const donationSchema = new mongoose.Schema({
  cause: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cause", // Assuming there's a Cause model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01, // Minimum donation amount
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
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  paymentMethod: {
    type: String,
    enum: ["card", "paypal", "other"], // Example payment methods
    default: "card",
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentDetails: {
    last4: {
      type: String,
    },
    cardName: {
      type: String,
    },
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Make sure we're exporting the model correctly
const DonationModel = mongoose.model("Donation", donationSchema)

export default DonationModel

