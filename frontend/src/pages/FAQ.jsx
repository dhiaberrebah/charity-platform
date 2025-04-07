"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import NavigationBar from "@/components/Navbar"
import UserNavigationBar from "@/components/UserNavigationBar"
import AdminNavbar from "@/components/AdminNavbar"
import { useAuth } from "../context/AuthContext"

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("general")
  const [openQuestions, setOpenQuestions] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated, isAdmin } = useAuth()

  // Determine which navbar to show based on authentication status
  const renderNavbar = () => {
    if (isAdmin) {
      return <AdminNavbar />
    } else if (isAuthenticated) {
      return <UserNavigationBar />
    } else {
      return <NavigationBar />
    }
  }

  const toggleQuestion = (id) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const categories = [
    { id: "general", label: "General Questions" },
    { id: "account", label: "Account & Registration" },
    { id: "donations", label: "Donations & Payments" },
    { id: "causes", label: "Creating Causes" },
    { id: "verification", label: "Verification Process" },
  ]

  const faqData = {
    general: [
      {
        id: "general-1",
        question: "What is CharityHub?",
        answer:
          "CharityHub is a crowdfunding platform that connects people in need with donors who want to help. Our platform allows users to create fundraising campaigns for various causes and enables donors to contribute to these causes securely.",
      },
      {
        id: "general-2",
        question: "How does CharityHub work?",
        answer:
          "Users can create fundraising campaigns by providing details about their cause, setting a funding goal, and sharing their story. Donors can browse through campaigns, learn about different causes, and make donations to support them. CharityHub ensures secure transactions and transparent fund management.",
      },
      {
        id: "general-3",
        question: "Is CharityHub available in my country?",
        answer:
          "Currently, CharityHub is available in select countries. We're continuously expanding our services to reach more regions. Please check our eligibility criteria or contact our support team to confirm availability in your country.",
      },
      {
        id: "general-4",
        question: "How does CharityHub ensure the legitimacy of campaigns?",
        answer:
          "We have a thorough verification process for all campaigns. This includes identity verification, documentation review, and continuous monitoring. Our team reviews each campaign before it goes live, and we encourage community reporting of suspicious activities.",
      },
    ],
    account: [
      {
        id: "account-1",
        question: "How do I create an account on CharityHub?",
        answer:
          "To create an account, click on the 'Sign Up' button on the top right of our homepage. You'll need to provide your email address, create a password, and fill in some basic information. You can also sign up using your Google or Facebook account for quicker registration.",
      },
      {
        id: "account-2",
        question: "Can I use CharityHub without creating an account?",
        answer:
          "You can browse campaigns and learn about causes without an account. However, to donate to a campaign or create your own fundraiser, you'll need to create an account for security and tracking purposes.",
      },
      {
        id: "account-3",
        question: "How do I reset my password?",
        answer:
          "If you've forgotten your password, click on the 'Login' button, then select 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password. Make sure to check your spam folder if you don't see the email in your inbox.",
      },
      {
        id: "account-4",
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account by going to your account settings and selecting 'Delete Account'. Please note that this action is irreversible, and you'll lose access to your donation history and any active campaigns you've created.",
      },
    ],
    donations: [
      {
        id: "donations-1",
        question: "What payment methods are accepted?",
        answer:
          "CharityHub accepts various payment methods including credit/debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. The available payment options may vary depending on your location.",
      },
      {
        id: "donations-2",
        question: "Are my donations tax-deductible?",
        answer:
          "Tax deductibility depends on the nature of the campaign and your country's tax laws. CharityHub provides donation receipts that you can use for tax purposes, but we recommend consulting with a tax professional to determine eligibility for tax deductions.",
      },
      {
        id: "donations-3",
        question: "Can I donate anonymously?",
        answer:
          "Yes, you can choose to make anonymous donations. During the donation process, you'll have the option to hide your name from public view. Your information will still be recorded in our system for security purposes, but it won't be visible to the campaign creator or other users.",
      },
      {
        id: "donations-4",
        question: "What happens if a campaign doesn't reach its goal?",
        answer:
          "Unlike some platforms, CharityHub allows campaign creators to keep the funds they raise even if they don't reach their goal. We believe that any amount can make a difference. Campaign creators can update their plans based on the actual funds received.",
      },
    ],
    causes: [
      {
        id: "causes-1",
        question: "What types of causes can I create on CharityHub?",
        answer:
          "CharityHub supports a wide range of causes including medical expenses, education, community projects, disaster relief, animal welfare, and personal emergencies. However, we prohibit campaigns for illegal activities, political campaigns, or anything that violates our terms of service.",
      },
      {
        id: "causes-2",
        question: "How long can my fundraising campaign run?",
        answer:
          "By default, campaigns can run for up to 60 days. However, you can set a shorter duration if you prefer. If you need more time after the initial period, you can request an extension, which our team will review on a case-by-case basis.",
      },
      {
        id: "causes-3",
        question: "How do I promote my campaign?",
        answer:
          "Sharing your campaign on social media is one of the most effective ways to reach potential donors. CharityHub provides easy sharing tools for various platforms. You can also share your campaign via email, messaging apps, or embed it on your website. Regular updates on your campaign page can help keep donors engaged.",
      },
      {
        id: "causes-4",
        question: "Can I edit my campaign after it's published?",
        answer:
          "Yes, you can edit certain aspects of your campaign after it's published, including the description, updates, and photos. However, some elements like the campaign title and funding goal require approval from our team if you want to change them after publication.",
      },
    ],
    verification: [
      {
        id: "verification-1",
        question: "Why do I need to verify my identity?",
        answer:
          "Identity verification helps us maintain a secure and trustworthy platform. It prevents fraud, ensures compliance with financial regulations, and builds donor confidence. This process is especially important for campaign creators who will be receiving funds.",
      },
      {
        id: "verification-2",
        question: "What documents do I need for verification?",
        answer:
          "Typically, you'll need a government-issued photo ID (passport, driver's license, or national ID card) and proof of address (utility bill, bank statement, or official correspondence dated within the last 3 months). For certain campaigns, additional documentation related to the cause may be required.",
      },
      {
        id: "verification-3",
        question: "How long does the verification process take?",
        answer:
          "Standard verification usually takes 1-2 business days. During high-volume periods or for complex cases, it might take up to 5 business days. You'll receive email notifications about the status of your verification process.",
      },
      {
        id: "verification-4",
        question: "What happens if my verification is rejected?",
        answer:
          "If your verification is rejected, you'll receive an email explaining the reason. Common reasons include unclear documents, mismatched information, or incomplete submissions. You can resubmit your verification with the corrected information. If you believe there's been an error, you can contact our support team for assistance.",
      },
    ],
  }

  // Filter questions based on search query
  const filteredFAQs = Object.entries(faqData).reduce((acc, [category, questions]) => {
    const filtered = questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {})

  // Check if there are any results after filtering
  const hasResults = Object.values(filteredFAQs).some((questions) => questions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      {renderNavbar()}

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about CharityHub, donations, and fundraising campaigns.
            </p>

            {/* Search bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-blue-800/30 border border-blue-500/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-300" />
              </div>
            </div>
          </motion.div>

          {searchQuery ? (
            // Search results view
            <div>
              {hasResults ? (
                Object.entries(filteredFAQs).map(([category, questions]) => (
                  <div key={category} className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-100 mb-4">
                      {categories.find((c) => c.id === category)?.label}
                    </h2>
                    <div className="space-y-4">
                      {questions.map((faq) => (
                        <motion.div
                          key={faq.id}
                          className="bg-blue-800/30 backdrop-blur-sm border border-blue-500/20 rounded-lg overflow-hidden"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center"
                            onClick={() => toggleQuestion(faq.id)}
                          >
                            <span className="font-medium text-white">{faq.question}</span>
                            {openQuestions[faq.id] ? (
                              <ChevronUp className="h-5 w-5 text-blue-300" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-blue-300" />
                            )}
                          </button>
                          {openQuestions[faq.id] && (
                            <motion.div
                              className="px-6 py-4 bg-blue-900/20 text-blue-100"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                            >
                              <p>{faq.answer}</p>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <motion.div
                  className="text-center py-12 bg-blue-800/30 backdrop-blur-sm border border-blue-500/20 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xl text-blue-100">No results found for "{searchQuery}"</p>
                  <p className="mt-2 text-blue-300">Try different keywords or browse categories below</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            // Category view
            <div>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-blue-800/30 text-blue-100 hover:bg-blue-700/50"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.label}
                  </motion.button>
                ))}
              </div>

              <div className="space-y-4">
                {faqData[activeCategory].map((faq) => (
                  <motion.div
                    key={faq.id}
                    className="bg-blue-800/30 backdrop-blur-sm border border-blue-500/20 rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <button
                      className="w-full px-6 py-4 text-left flex justify-between items-center"
                      onClick={() => toggleQuestion(faq.id)}
                    >
                      <span className="font-medium text-white">{faq.question}</span>
                      {openQuestions[faq.id] ? (
                        <ChevronUp className="h-5 w-5 text-blue-300" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-blue-300" />
                      )}
                    </button>
                    {openQuestions[faq.id] && (
                      <motion.div
                        className="px-6 py-4 bg-blue-900/20 text-blue-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Still have questions?</h3>
            <p className="text-blue-100 mb-6">
              If you couldn't find the answer to your question, feel free to contact our support team.
            </p>
            <motion.a
              href="/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ

