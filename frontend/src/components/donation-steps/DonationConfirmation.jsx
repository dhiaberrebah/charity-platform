"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Check } from "lucide-react"

const DonationConfirmation = ({ cause, formData, donationAmount, handleSubmit, prevStep, isSubmitting }) => {
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
                {formData.isAnonymous ? "Anonymous" : `${formData.firstName} ${formData.lastName}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cause ID:</span>
              <span className="font-medium text-gray-800 text-xs overflow-hidden text-ellipsis">{cause._id}</span>
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
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{formData.email}</p>
                </div>
              </div>

              {formData.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{formData.phone}</p>
                </div>
              )}

              {formData.address && (
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">
                    {formData.address}
                    {formData.city && `, ${formData.city}`}
                    {formData.country && `, ${formData.country}`}
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
                <p className="text-gray-800">•••• •••• •••• {formData.cardNumber.slice(-4)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name on Card</p>
                  <p className="text-gray-800">{formData.cardName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="text-gray-800">{formData.expiryDate}</p>
                </div>
              </div>
            </div>
          </div>

          {formData.message && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-800">Message</h4>
              </div>
              <div className="p-4">
                <p className="text-gray-800">{formData.message}</p>
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

export default DonationConfirmation

