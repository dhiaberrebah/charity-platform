"use client"

import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import NavigationBar from "@/components/NavigationBar"

const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <NavigationBar />
      <div className="pt-24 px-4 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-blue-500/20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-blue-100 mb-8">
            You don't have permission to access this page. Please contact an administrator if you believe this is an
            error.
          </p>

          <div className="flex flex-col gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => navigate("/")} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full border-blue-400 text-blue-100 hover:bg-blue-800/50"
              >
                Go Back
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Unauthorized

