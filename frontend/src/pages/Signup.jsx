"use client"

import { useState, useCallback, memo, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Github, Mail, Heart, CheckCircle, Sparkles, HandHeart, Users, Globe } from "lucide-react"
import NavigationBar from "../components/NavigationBar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

// Memoized floating heart component for better performance
const FloatingHeart = memo(({ heart }) => (
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

FloatingHeart.displayName = "FloatingHeart"

// Memoized feature card for better performance
const FeatureCard = memo(({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg flex items-start"
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Icon className="h-6 w-6 mr-3 text-blue-300 mt-1 flex-shrink-0" />
    <div>
      <h3 className="font-semibold text-blue-100 mb-1">{title}</h3>
      <p className="text-sm text-blue-200">{description}</p>
    </div>
  </motion.div>
))

FeatureCard.displayName = "FeatureCard"

// Memoized form field component
const FormField = memo(({ label, id, type, placeholder, value, onChange, required, showPassword, togglePassword }) => (
  <div className="grid gap-2">
    <Label htmlFor={id} className="text-blue-100">
      {label}
    </Label>
    <div className={type === "password" ? "relative" : undefined}>
      <Input
        id={id}
        name={id}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-white/10 border-blue-600/30 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
      />
      {type === "password" && (
        <button
          type="button"
          id={`toggle-${id}`}
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  </div>
))

FormField.displayName = "FormField"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: "",
    adresse: "",
    telephone: "",
    email: "",
    password: "",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [direction, setDirection] = useState(1)
  const navigate = useNavigate()

  // Pre-compute hearts array to avoid recalculation on each render
  const hearts = useMemo(
    () =>
      Array(15)
        .fill(0)
        .map((_, i) => ({
          id: i,
          size: Math.random() * 20 + 10,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 10,
          opacity: Math.random() * 0.3 + 0.1,
        })),
    [],
  )

  // Memoize the renderFloatingHearts function to prevent unnecessary recalculations
  const renderFloatingHearts = useCallback(() => {
    return hearts.map((heart) => <FloatingHeart key={heart.id} heart={heart} />)
  }, [hearts])

  const handleChange = useCallback((e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }, [])

  const handleNextStepWithAnimation = useCallback(() => {
    setDirection(1)
    setCurrentStep(2)
  }, [])

  const handlePrevStepWithAnimation = useCallback(() => {
    setDirection(-1)
    setCurrentStep(1)
  }, [])

  const handleSignUp = useCallback(
    async (e) => {
      e.preventDefault()
      try {
        await axios.post("http://localhost:5001/api/auth/signup", formData)
        navigate("/login")
      } catch (error) {
        console.error("Signup error:", error.response?.data || error.message)
        setError(error.response?.data?.message || "Signup failed. Please try again.")
      }
    },
    [formData, navigate],
  )

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  // Animation variants for form steps - memoized to prevent recreation
  const formVariants = useMemo(
    () => ({
      hidden: (direction) => ({
        x: direction > 0 ? 200 : -200,
        opacity: 0,
      }),
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          type: "spring",
          stiffness: 80,
          damping: 15,
        },
      },
      exit: (direction) => ({
        x: direction > 0 ? -200 : 200,
        opacity: 0,
        transition: {
          duration: 0.3,
        },
      }),
    }),
    [],
  )

  // Feature data
  const features = useMemo(
    () => [
      {
        icon: Users,
        title: "Join a community",
        description: "Connect with passionate volunteers making real change",
      },
      {
        icon: Globe,
        title: "Global impact",
        description: "Support initiatives that matter across the world",
      },
      {
        icon: Sparkles,
        title: "Track your impact",
        description: "See how your contributions make a difference",
      },
      {
        icon: Heart,
        title: "Spread kindness",
        description: "Every act of giving creates ripples of change",
      },
    ],
    [],
  )

  // Benefits list
  const benefits = useMemo(
    () => [
      "Join a community of passionate volunteers making real change",
      "Connect with local and global charity initiatives",
      "Track your impact and contributions over time",
    ],
    [],
  )

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
              {/* Content here */}
            </div>

            {/* Animated impact visualization - optimized with memoization */}
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
                <h1 className="text-4xl font-bold mb-6 text-blue-100">Make a difference today</h1>
                <p className="text-xl mb-8 text-blue-200 max-w-md">
                  Join our community of changemakers and help create positive impact around the world.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {features.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  ))}
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

            {/* Animated circles - reduced animation complexity */}
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

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] relative z-10">
              <motion.div
                className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight text-white">Create an account</h1>
                  <p className="text-sm text-blue-100">Join our community and start making a difference today</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-6 mt-6">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-500 text-white" : "bg-blue-900/50 text-blue-100"}`}
                      animate={{
                        scale: currentStep === 1 ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.5, 1],
                      }}
                    >
                      1
                    </motion.div>
                    <span className="text-xs mt-1 text-blue-100">Personal Info</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <motion.div
                      className="h-1 w-full bg-blue-900/50"
                      animate={{
                        backgroundColor: currentStep >= 2 ? "rgb(59 130 246)" : "rgba(30, 58, 138, 0.5)",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-500 text-white" : "bg-blue-900/50 text-blue-100"}`}
                      animate={{
                        scale: currentStep === 2 ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.5, 1],
                      }}
                    >
                      2
                    </motion.div>
                    <span className="text-xs mt-1 text-blue-100">Account Details</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid gap-6 relative overflow-hidden">
                  <form className="space-y-4" onSubmit={handleSignUp}>
                    <AnimatePresence custom={direction} mode="wait">
                      {currentStep === 1 ? (
                        <motion.div
                          key="step1"
                          custom={direction}
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="grid gap-4"
                        >
                          <FormField
                            label="Nom"
                            id="nom"
                            type="text"
                            placeholder="Dupont"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                          />
                          <FormField
                            label="Prénom"
                            id="prenom"
                            type="text"
                            placeholder="Jean"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                          />
                          <FormField
                            label="Age"
                            id="age"
                            type="number"
                            placeholder="30"
                            value={formData.age}
                            onChange={handleChange}
                            required
                          />
                          <FormField
                            label="Adresse"
                            id="adresse"
                            type="text"
                            placeholder="123 Rue de la Paix, 75000 Paris"
                            value={formData.adresse}
                            onChange={handleChange}
                            required
                          />

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-2">
                            <Button
                              type="button"
                              onClick={handleNextStepWithAnimation}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                            >
                              Continue
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step2"
                          custom={direction}
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="grid gap-4"
                        >
                          <FormField
                            label="Numéro de téléphone"
                            id="telephone"
                            type="tel"
                            placeholder="+33 1 23 45 67 89"
                            value={formData.telephone}
                            onChange={handleChange}
                            required
                          />
                          <FormField
                            label="Email"
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                          <FormField
                            label="Mot de passe"
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            showPassword={showPassword}
                            togglePassword={togglePassword}
                          />

                          <div className="flex space-x-3 mt-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevStepWithAnimation}
                                className="w-full border-blue-500/50 text-blue-100 hover:bg-blue-800/50 hover:text-white"
                              >
                                Back
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                                S'inscrire
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-blue-700/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-blue-800/50 backdrop-blur-sm px-4 text-blue-200 font-medium rounded-full">
                        Ou continuer avec
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="bg-white/5 border-blue-500/30 text-blue-100 hover:bg-blue-800/50 hover:text-white"
                    >
                      <Github className="mr-2 h-4 w-4" /> Github
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/5 border-blue-500/30 text-blue-100 hover:bg-blue-800/50 hover:text-white"
                    >
                      <Mail className="mr-2 h-4 w-4" /> Google
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {benefits.map((text, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-100">{text}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-sm text-blue-200">
                    Vous avez déjà un compte?{" "}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp

