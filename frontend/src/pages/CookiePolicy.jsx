"use client"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const CookiePolicy = () => {
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
            <h1 className="text-3xl font-bold mb-6 text-white">Cookie Policy</h1>
            <div className="prose prose-invert max-w-none text-blue-100">
              <p className="mb-4">
                Last Updated:{" "}
                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">1. Introduction</h2>
              <p className="mb-4">
                This Cookie Policy explains how CharityHub ("we", "us", and "our") uses cookies and similar technologies
                to recognize you when you visit our website. It explains what these technologies are and why we use
                them, as well as your rights to control our use of them.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">2. What Are Cookies?</h2>
              <p className="mb-4">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                Cookies are widely used by website owners in order to make their websites work, or to work more
                efficiently, as well as to provide reporting information.
              </p>
              <p className="mb-4">
                Cookies set by the website owner (in this case, CharityHub) are called "first-party cookies". Cookies
                set by parties other than the website owner are called "third-party cookies". Third-party cookies enable
                third-party features or functionality to be provided on or through the website (e.g., advertising,
                interactive content and analytics). The parties that set these third-party cookies can recognize your
                computer both when it visits the website in question and also when it visits certain other websites.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">3. Why Do We Use Cookies?</h2>
              <p className="mb-4">
                We use first-party and third-party cookies for several reasons. Some cookies are required for technical
                reasons in order for our website to operate, and we refer to these as "essential" or "strictly
                necessary" cookies. Other cookies also enable us to track and target the interests of our users to
                enhance the experience on our website. Third parties serve cookies through our website for advertising,
                analytics and other purposes.
              </p>
              <p className="mb-4">
                The specific types of first and third-party cookies served through our website and the purposes they
                perform are described below:
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">4. Types of Cookies We Use</h2>
              <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-200">Essential Cookies</h3>
              <p className="mb-4">
                These cookies are strictly necessary to provide you with services available through our website and to
                use some of its features, such as access to secure areas. Because these cookies are strictly necessary
                to deliver the website, you cannot refuse them without impacting how our website functions.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-200">Performance and Functionality Cookies</h3>
              <p className="mb-4">
                These cookies are used to enhance the performance and functionality of our website but are non-essential
                to their use. However, without these cookies, certain functionality may become unavailable.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-200">Analytics and Customization Cookies</h3>
              <p className="mb-4">
                These cookies collect information that is used either in aggregate form to help us understand how our
                website is being used or how effective our marketing campaigns are, or to help us customize our website
                for you in order to enhance your experience.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-200">Advertising Cookies</h3>
              <p className="mb-4">
                These cookies are used to make advertising messages more relevant to you and your interests. They also
                perform functions like preventing the same ad from continuously reappearing, ensuring that ads are
                properly displayed, and in some cases selecting advertisements that are based on your interests.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-200">Social Media Cookies</h3>
              <p className="mb-4">
                These cookies are used to enable you to share pages and content that you find interesting on our website
                through third-party social networking and other websites. These cookies may also be used for advertising
                purposes.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">5. How Can You Control Cookies?</h2>
              <p className="mb-4">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie
                preferences by clicking on the appropriate opt-out links provided in the cookie banner on our website.
              </p>
              <p className="mb-4">
                You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject
                cookies, you may still use our website though your access to some functionality and areas of our website
                may be restricted. As the means by which you can refuse cookies through your web browser controls vary
                from browser-to-browser, you should visit your browser's help menu for more information.
              </p>
              <p className="mb-4">
                In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would
                like to find out more information, please visit{" "}
                <a href="http://www.aboutads.info/choices/" className="text-blue-300 hover:text-blue-100 underline">
                  http://www.aboutads.info/choices/
                </a>{" "}
                or{" "}
                <a href="http://www.youronlinechoices.com" className="text-blue-300 hover:text-blue-100 underline">
                  http://www.youronlinechoices.com
                </a>
                .
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
                6. How Often Will We Update This Cookie Policy?
              </h2>
              <p className="mb-4">
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the
                cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this
                Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
              <p className="mb-4">The date at the top of this Cookie Policy indicates when it was last updated.</p>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">7. Where Can You Get Further Information?</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies or other technologies, please contact us at:
              </p>
              <p className="mb-4">
                Email: privacy@charityhub.org
                <br />
                Phone: +1 (123) 456-7890
                <br />
                Address: 123 Charity Street, City, Country
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicy
