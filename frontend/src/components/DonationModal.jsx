"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ArrowLeft, ArrowRight, CreditCard, DollarSign, Check } from "lucide-react"
import { toast } from "sonner"

const DonationModal = ({ cause, causeId, onClose }) => {
  // Single step state
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data state
  const [amount, setAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [message, setMessage] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  // Error states
  const [amountError, setAmountError] = useState("")
  const [personalErrors, setPersonalErrors] = useState({})
  const [paymentErrors, setPaymentErrors] = useState({})

  // Debug logging
  console.log("Current form state:", {
    step,
    amount,
    customAmount,
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    country,
    isAnonymous,
    message,
    cardNumber,
    cardName,
    expiryDate,
    cvv,
  })

  // Navigation functions
  const nextStep = () => {
    window.scrollTo(0, 0)
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    window.scrollTo(0, 0)
    setStep((prev) => prev - 1)
  }

  // Validation functions
  const validateAmount = () => {
    const donationAmount = customAmount ? Number.parseFloat(customAmount) : amount
    if (!donationAmount || donationAmount <= 0) {
      setAmountError("Please select or enter a valid donation amount")
      return false
    }
    setAmountError("")
    return true
  }

  const validatePersonalInfo = () => {
    const errors = {}

    if (!firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    setPersonalErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePayment = () => {
    const errors = {}

    if (!cardNumber.trim()) {
      errors.cardNumber = "Card number is required"
    } else if (cardNumber.replace(/\s/g, "").length < 16) {
      errors.cardNumber = "Please enter a valid card number"
    }

    if (!cardName.trim()) {
      errors.cardName = "Name on card is required"
    }

    if (!expiryDate.trim()) {
      errors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      errors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    }

    if (!cvv.trim()) {
      errors.cvv = "CVV is required"
    } else if (cvv.length < 3) {
      errors.cvv = "Please enter a valid CVV"
    }

    setPaymentErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handler functions
  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount)
    setCustomAmount("")
    setAmountError("")
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value

    // Allow only numbers and decimal point
    if (value && !/^\d*\.?\d{0,2}$/.test(value)) {
      return
    }

    setCustomAmount(value)
    setAmount(0)
    setAmountError("")
  }

  const handleCardNumberChange = (e) => {
    const value = e.target.value

    // Format card number with spaces
    const formattedValue = value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19)

    setCardNumber(formattedValue)

    if (paymentErrors.cardNumber) {
      setPaymentErrors({ ...paymentErrors, cardNumber: "" })
    }
  }

  const handleExpiryDateChange = (e) => {
    const value = e.target.value

    // Format expiry date with slash
    const formattedValue = value
      .replace(/\//g, "")
      .replace(/(\d{2})(\d{0,2})/, "$1/$2")
      .slice(0, 5)

    setExpiryDate(formattedValue)

    if (paymentErrors.expiryDate) {
      setPaymentErrors({ ...paymentErrors, expiryDate: "" })
    }
  }

  const handleCvvChange = (e) => {
    const value = e.target.value

    // Format CVV (3-4 digits only)
    const formattedValue = value.replace(/\D/g, "").slice(0, 4)

    setCvv(formattedValue)

    if (paymentErrors.cvv) {
      setPaymentErrors({ ...paymentErrors, cvv: "" })
    }
  }

  // Step navigation with validation
  const handleAmountNext = () => {
    if (validateAmount()) {
      nextStep()
    }
  }

  const handlePersonalNext = () => {
    if (validatePersonalInfo()) {
      nextStep()
    }
  }

  const handlePaymentNext = () => {
    if (validatePayment()) {
      nextStep()
    }
  }

  // Form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Get the donation amount
      const donationAmount = customAmount ? Number.parseFloat(customAmount) : amount

      // Prepare the data to send
      console.log("Cause object:", cause)
      console.log("CauseId being used for donation:", causeId || cause._id)

      const donationPayload = {
        causeId: causeId || cause._id,
        amount: donationAmount,
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        country: country || null,
        paymentMethod: "card",
        isAnonymous,
        message: message || null,
        paymentDetails: {
          last4: cardNumber ? cardNumber.slice(-4) : "1234",
          cardName,
        },
      }

      console.log("Sending donation data:", JSON.stringify(donationPayload, null, 2))

      // Make the API call
      console.log("Making API request to: http://localhost:5001/api/donations")
      const response = await fetch("http://localhost:5001/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationPayload),
      })

      console.log("Response status:", response.status)

      // Get the response body as text first
      const responseText = await response.text()
      console.log("Response body (text):", responseText)

      // Try to parse as JSON if possible
      let result
      try {
        result = JSON.parse(responseText)
        console.log("Response parsed as JSON:", result)
      } catch (parseError) {
        console.error("Error parsing response as JSON:", parseError)
        throw new Error(`Failed to parse response: ${responseText}`)
      }

      if (!response.ok) {
        throw new Error(`Failed to process donation: ${result.message || response.status}`)
      }

      // Show success toast
      toast.success("Donation processed successfully!")
      console.log("Donation successful:", result)

      // Move to success step
      nextStep()
    } catch (error) {
      console.error("Error processing donation:", error)
      toast.error(`Failed to process donation: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render step indicators
  const renderStepIndicators = () => {
    const steps = [
      { number: 1, icon: DollarSign, label: "Amount" },
      { number: 2, icon: null, label: "Information" },
      { number: 3, icon: CreditCard, label: "Payment" },
      { number: 4, icon: null, label: "Confirm" },
    ]

    return (
      <div className="flex justify-center mb-8">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= s.number ? "border-blue-500 bg-blue-500 text-white" : "border-blue-300 text-blue-300"
              }`}
            >
              {s.icon ? <s.icon size={18} /> : s.number}
            </div>

            {i < steps.length - 1 && (
              <div className={`w-12 h-0.5 ${step > s.number ? "bg-blue-500" : "bg-blue-300"}`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderAmountStep()
      case 2:
        return renderPersonalInfoStep()
      case 3:
        return renderPaymentStep()
      case 4:
        return renderConfirmationStep()
      case 5:
        return renderSuccessStep()
      default:
        return null
    }
  }

  // Step 1: Amount
  const renderAmountStep = () => {
    const predefinedAmounts = [10, 25, 50, 100, 250, 500]

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Select Donation Amount</h3>
          <p className="text-gray-600 mb-4">Choose a predefined amount or enter a custom amount below.</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  amount === amt && !customAmount
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() => handleAmountSelect(amt)}
              >
                ${amt}
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
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter amount"
                className={`pl-8 w-full p-3 border ${
                  amountError ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
              />
            </div>
            {amountError && <p className="mt-1 text-sm text-red-500">{amountError}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            type="button"
            onClick={handleAmountNext}
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

  // Step 2: Personal Information
  const renderPersonalInfoStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Your Information</h3>
          <p className="text-gray-600 mb-4">Please provide your contact information for this donation.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  if (personalErrors.firstName) {
                    setPersonalErrors({ ...personalErrors, firstName: "" })
                  }
                }}
                className={`w-full p-3 border ${
                  personalErrors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
                placeholder="Enter first name"
              />
              {personalErrors.firstName && <p className="mt-1 text-sm text-red-500">{personalErrors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  if (personalErrors.lastName) {
                    setPersonalErrors({ ...personalErrors, lastName: "" })
                  }
                }}
                className={`w-full p-3 border ${
                  personalErrors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
                placeholder="Enter last name"
              />
              {personalErrors.lastName && <p className="mt-1 text-sm text-red-500">{personalErrors.lastName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (personalErrors.email) {
                    setPersonalErrors({ ...personalErrors, email: "" })
                  }
                }}
                className={`w-full p-3 border ${
                  personalErrors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
                placeholder="Enter email address"
              />
              {personalErrors.email && <p className="mt-1 text-sm text-red-500">{personalErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address (Optional)
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City (Optional)
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country (Optional)
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Make my donation anonymous</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Your name will not be displayed publicly if you check this option.
            </p>
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Add a message of support..."
            ></textarea>
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
            onClick={handlePersonalNext}
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

  // Step 3: Payment
  const renderPaymentStep = () => {
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
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className={`pl-10 w-full p-3 border ${
                    paymentErrors.cardNumber ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
                />
              </div>
              {paymentErrors.cardNumber && <p className="mt-1 text-sm text-red-500">{paymentErrors.cardNumber}</p>}
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => {
                  setCardName(e.target.value)
                  if (paymentErrors.cardName) {
                    setPaymentErrors({ ...paymentErrors, cardName: "" })
                  }
                }}
                placeholder="John Doe"
                className={`w-full p-3 border ${
                  paymentErrors.cardName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
              />
              {paymentErrors.cardName && <p className="mt-1 text-sm text-red-500">{paymentErrors.cardName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  className={`w-full p-3 border ${
                    paymentErrors.expiryDate ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
                />
                {paymentErrors.expiryDate && <p className="mt-1 text-sm text-red-500">{paymentErrors.expiryDate}</p>}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className={`w-full p-3 border ${
                    paymentErrors.cvv ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
                />
                {paymentErrors.cvv && <p className="mt-1 text-sm text-red-500">{paymentErrors.cvv}</p>}
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
            onClick={handlePaymentNext}
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

  // Step 4: Confirmation
  const renderConfirmationStep = () => {
    const donationAmount = customAmount ? Number.parseFloat(customAmount) : amount

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Confirm Your Donation</h3>
          <p className="text-gray-600 mb-4">Please review your donation details before proceeding.</p>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">Donation Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Cause:</span>
                <span className="font-medium text-gray-800">{cause.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-800">${donationAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donor:</span>
                <span className="font-medium text-gray-800">
                  {isAnonymous ? "Anonymous" : `${firstName} ${lastName}`}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-800">Personal Information</h4>
              </div>
              <div className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-800">
                      {firstName} {lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{email}</p>
                  </div>
                </div>

                {phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{phone}</p>
                  </div>
                )}

                {address && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-800">
                      {address}
                      {city && `, ${city}`}
                      {country && `, ${country}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-800">Payment Information</h4>
              </div>
              <div className="p-4 space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Card Number</p>
                  <p className="text-gray-800">•••• •••• •••• {cardNumber.slice(-4)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name on Card</p>
                    <p className="text-gray-800">{cardName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="text-gray-800">{expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">Message</h4>
                </div>
                <div className="p-4">
                  <p className="text-gray-800">{message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <motion.button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            <ArrowLeft size={18} /> Back
          </motion.button>

          <motion.button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Processing...
              </>
            ) : (
              <>
                Complete Donation <Check size={18} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    )
  }

  // Step 5: Success
  const renderSuccessStep = () => {
    const donationAmount = customAmount ? Number.parseFloat(customAmount) : amount

    const handleShare = (platform) => {
      const url = window.location.href
      const text = `I just donated $${donationAmount.toFixed(2)} to ${cause.title}!`

      let shareUrl

      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          break
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
          break
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
          break
        default:
          return
      }

      window.open(shareUrl, "_blank", "width=600,height=400")
    }

    return (
      <div className="text-center space-y-6 py-4">
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            <Check className="h-24 w-24 text-green-500" strokeWidth={2} />
          </motion.div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-blue-900 mb-2">Thank You for Your Donation!</h3>
          <p className="text-gray-600 mb-4">
            Your donation of <span className="font-semibold">${donationAmount.toFixed(2)}</span> to{" "}
            <span className="font-semibold">{cause.title}</span> has been processed successfully.
          </p>
          <p className="text-gray-600">
            A confirmation email has been sent to <span className="font-semibold">{email}</span>.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-md mx-auto">
          <p className="text-blue-800 font-medium mb-2">Donation Reference</p>
          <p className="text-blue-900 font-bold text-xl">
            #{Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-gray-700 font-medium">Share your contribution</p>
          <div className="flex justify-center gap-3">
            <motion.button
              onClick={() => handleShare("facebook")}
              className="p-3 bg-blue-600 text-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => handleShare("twitter")}
              className="p-3 bg-blue-400 text-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => handleShare("linkedin")}
              className="p-3 bg-blue-700 text-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="pt-4">
          <motion.button
            onClick={onClose}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-900">
            {step === 5 ? "Donation Complete" : `Donate to ${cause.title}`}
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        <div className="p-6">
          {step < 5 && renderStepIndicators()}

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DonationModal

