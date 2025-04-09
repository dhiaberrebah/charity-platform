"use client"
import { motion } from "framer-motion"
import { ArrowLeft } from 'lucide-react'
import { Link } from "react-router-dom"

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link to="/" className="inline-flex items-center text-blue-300 hover:text-blue-100 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-lg shadow-md border border-blue-500/20"
          >
            <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
            <div className="prose prose-invert max-w-none text-blue-100">
              <p className="mb-4">
                Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">1. Introduction</h2>
              <p className="mb-4">
                Welcome to CharityHub. These terms and conditions outline the rules and regulations for the use of our website.
              </p>
              <p className="mb-4">
                By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use CharityHub if you do not accept all of the terms and conditions stated on this page.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">2. License to Use</h2>
              <p className="mb-4">
                Unless otherwise stated, CharityHub and/or its licensors own the intellectual property rights for all material on CharityHub. All intellectual property rights are reserved.
              </p>
              <p className="mb-4">
                You may view and/or print pages from the website for your own personal use subject to restrictions set in these terms and conditions.
              </p>
              <p className="mb-4">
                You must not:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Republish material from this website</li>
                <li>Sell, rent or sub-license material from this website</li>
                <li>Reproduce, duplicate or copy material from this website</li>
                <li>Redistribute content from CharityHub (unless content is specifically made for redistribution)</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">3. User Accounts</h2>
              <p className="mb-4">
                When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the service.
              </p>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">4. Donations</h2>
              <p className="mb-4">
                By making a donation through our platform, you agree to the following:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>You are authorized to use the payment method you provide</li>
                <li>Your donation is voluntary and non-refundable</li>
                <li>We will provide you with a receipt for tax purposes where applicable</li>
                <li>We may share your donation information with the specific cause or charity you are supporting</li>
                <li>We may contact you regarding your donation or similar causes you might be interested in</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">5. User Content</h2>
              <p className="mb-4">
                Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post on or through the service, including its legality, reliability, and appropriateness.
              </p>
              <p className="mb-4">
                By posting content on or through the service, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>The content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms</li>
                <li>The posting of your content on or through the service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">6. Prohibited Uses</h2>
              <p className="mb-4">
                You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation</li>
                <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">7. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall CharityHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your access to or use of or inability to access or use the service</li>
                <li>Any conduct or content of any third party on the service</li>
                <li>Any content obtained from the service</li>
                <li>Unauthorized access, use or alteration of your transmissions or content</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">8. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed and construed in accordance with the laws of [Your Country], without regard to its conflict of law provisions.
              </p>
              <p className="mb-4">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">9. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="mb-4">
                By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the service.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">10. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mb-4">
                Email: legal@charityhub.org<br />
                Phone: +1 (123) 456-7890<br />
                Address: 123 Charity Street, City, Country
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
