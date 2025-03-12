"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, CreditCard } from "lucide-react"

const PaymentMethod = ({ formData, handleInputChange, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    console.log(`Payment input change - Name: ${name}, Value: ${value}`)

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      const event = {
        target: {
          name: "cardNumber",
          value: formattedValue,
          type: "text",
        },
      }
      handleInputChange(event)
    }
    // Format expiry date with slash
    else if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\//g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5)

      const event = {
        target: {
          name: "expiryDate",
          value: formattedValue,
          type: "text",
        },
      }
      handleInputChange(event)
    }
    // Format CVV (3-4 digits only)
    else if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 4)

      const event = {
        target: {
          name: "cvv",
          value: formattedValue,
          type: "text",
        },
      }
      handleInputChange(event)
    } else {
      handleInputChange(e)
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Card validation
    if (!formData.cardNumber?.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    if (!formData.cardName?.trim()) {
      newErrors.cardName = "Name on card is required"
    }

    if (!formData.expiryDate?.trim()) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    } else {
      // Check if card is expired
      const [month, year] = formData.expiryDate.split("/")
      const expiryDate = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1)
      const currentDate = new Date()

      if (expiryDate < currentDate) {
        newErrors.expiryDate = "Card has expired"
      }
    }

    if (!formData.cvv?.trim()) {
      newErrors.cvv = "CVV is required"
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      nextStep()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-blue-900 mb-2">Payment Method</h3>
        <p className="text-gray-600 mb-4">Please enter your payment details to complete the donation.</p>

        <div className="space-y-4 mb-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CreditCard size={18} className="text-gray-500" />
              </div>
              <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                value={formData.cardNumber || ""}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className={`pl-10 w-full p-3 border ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
          </div>

          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input
              id="cardName"
              type="text"
              name="cardName"
              value={formData.cardName || ""}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full p-3 border ${
                errors.cardName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.cardName && <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="text"
                name="expiryDate"
                value={formData.expiryDate || ""}
                onChange={handleChange}
                placeholder="MM/YY"
                className={`w-full p-3 border ${
                  errors.expiryDate ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                name="cvv"
                value={formData.cvv || ""}
                onChange={handleChange}
                placeholder="123"
                className={`w-full p-3 border ${
                  errors.cvv ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a demo payment form. In a real application, you would integrate with a
            payment processor like Stripe, PayPal, or another secure payment gateway.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <motion.button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        <motion.button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Review Donation <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  )
}

export default PaymentMethod

