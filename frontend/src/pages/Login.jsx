"use client"

import { lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { HandHeart, Users, Globe, Sparkles, Heart, CheckCircle } from "lucide-react"
import NavigationBar from "../components/NavigationBar"
import { motion } from "framer-motion"

const LoginForm = lazy(() => import("../components/LoginForm.jsx"))

const Login = () => {
  // Animated floating hearts
  const renderFloatingHearts = () => {
    const hearts = Array(15)
      .fill(0)
      .map((_, i) => ({
        id: i,
        size: Math.random() * 20 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.3 + 0.1,
      }))

    return hearts.map((heart) => (
      <motion.div
        key={heart.id}
        className="absolute text-blue-300"
        style={{
          fontSize: heart.size,
          left: `${heart.x}%`,
          top: `${heart.y}%`,
          opacity: 0,
        }}
        animate={{
          y: [0, -100],
          opacity: [0, heart.opacity, 0],
          scale: [0.5, 1, 0.8],
        }}
        transition={{
          duration: heart.duration,
          repeat: Number.POSITIVE_INFINITY,
          delay: heart.delay,
          ease: "easeInOut",
        }}
      >
        ❤️
      </motion.div>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <NavigationBar />
      <div className="pt-16">
        <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <motion.div
            className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Background with world map pattern */}
            <div className="absolute inset-0 bg-indigo-900 opacity-50">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('/src/assets/img/world-map-dots.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.2,
                }}
              ></div>
            </div>

            {/* Animated impact visualization */}
            <div className="absolute inset-0 overflow-hidden">{renderFloatingHearts()}</div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              <motion.div
                className="flex items-center text-2xl font-bold mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ duration: 2, delay: 1.5, repeat: 1 }}
                >
                  <HandHeart className="mr-3 h-8 w-8 text-blue-300" />
                </motion.div>
                <span className="text-blue-100">CharityHub</span>
              </motion.div>

              <motion.div
                className="flex-1 flex flex-col justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h1 className="text-4xl font-bold mb-6 text-blue-100">Welcome back</h1>
                <p className="text-xl mb-8 text-blue-200 max-w-md">
                  Continue your journey of making a positive impact around the world.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <motion.div
                    className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg flex items-start"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Users className="h-6 w-6 mr-3 text-blue-300 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-100 mb-1">Join a community</h3>
                      <p className="text-sm text-blue-200">Connect with passionate volunteers making real change</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg flex items-start"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Globe className="h-6 w-6 mr-3 text-blue-300 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-100 mb-1">Global impact</h3>
                      <p className="text-sm text-blue-200">Support initiatives that matter across the world</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg flex items-start"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Sparkles className="h-6 w-6 mr-3 text-blue-300 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-100 mb-1">Track your impact</h3>
                      <p className="text-sm text-blue-200">See how your contributions make a difference</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg flex items-start"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Heart className="h-6 w-6 mr-3 text-blue-300 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-100 mb-1">Spread kindness</h3>
                      <p className="text-sm text-blue-200">Every act of giving creates ripples of change</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="mt-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <blockquote className="border-l-4 border-blue-400 pl-4 py-2">
                  <p className="text-lg text-blue-100 italic mb-2">"Peace begins with a smile."</p>
                  <footer className="text-sm text-blue-300">Mother Teresa</footer>
                </blockquote>
              </motion.div>
            </div>
          </motion.div>

          <div className="lg:p-8 relative">
            {/* Background with subtle pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-800/80 backdrop-blur-sm"></div>

            {/* Animated circles */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full"
              style={{ filter: "blur(60px)", transform: "translate(30%, -30%)" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" }}
            />

            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full"
              style={{ filter: "blur(60px)", transform: "translate(-30%, 30%)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", delay: 2 }}
            />

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] relative z-10">
              <motion.div
                className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
                  <p className="text-sm text-blue-200">Enter your credentials to access your account</p>
                </div>

                <Suspense
                  fallback={
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-300"></div>
                    </div>
                  }
                >
                  <LoginForm />
                </Suspense>

                <p className="text-center text-sm text-blue-200 mt-6">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                    Sign up
                  </Link>
                </p>
              </motion.div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-100">Join a community of passionate volunteers making real change</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-100">Connect with local and global charity initiatives</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-100">Track your impact and contributions over time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

