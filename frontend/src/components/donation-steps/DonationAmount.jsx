"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const DonationAmount = ({ formData, handleInputChange, nextStep }) => {
  const [error, setError] = useState("")

  const predefinedAmounts = [10, 25, 50, 100, 250, 500]

  const handleAmountSelect = (amount) => {
    // Create a synthetic event object
    const event = {
      target: {
        name: "amount",
        value: amount,
        type: "number",
      },
    }

    // Call the parent's handleInputChange
    handleInputChange(event)

    // Also clear custom amount
    const customEvent = {
      target: {
        name: "customAmount",
        value: "",
        type: "text",
      },
    }
    handleInputChange(customEvent)

    setError("")
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value

    // Allow only numbers and decimal point
    if (value && !/^\d*\.?\d{0,2}$/.test(value)) {
      return
    }

    // Create a synthetic event for the custom amount
    const customEvent = {
      target: {
        name: "customAmount",
        value: value,
        type: "text",
      },
    }
    handleInputChange(customEvent)

    // Reset the predefined amount
    const amountEvent = {
      target: {
        name: "amount",
        value: 0,
        type: "number",
      },
    }
    handleInputChange(amountEvent)

    setError("")
  }

  const handleNext = () => {
    // Validate amount
    const amount = formData.customAmount ? Number.parseFloat(formData.customAmount) : formData.amount

    if (!amount || amount <= 0) {
      setError("Please select or enter a valid donation amount")
      return
    }

    nextStep()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-blue-900 mb-2">Select Donation Amount</h3>
        <p className="text-gray-600 mb-4">Choose a predefined amount or enter a custom amount below.</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                formData.amount === amount && !formData.customAmount
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => handleAmountSelect(amount)}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              name="customAmount"
              value={formData.customAmount || ""}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount"
              className={`pl-8 w-full p-3 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  )
}

export default DonationAmount

