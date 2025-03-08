"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Github, Mail, Heart, CheckCircle } from "lucide-react"
import NavigationBar from "../components/NavigationBar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import axios from "axios"

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

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleNextStep = () => {
    setCurrentStep(2)
  }

  const handlePrevStep = () => {
    setCurrentStep(1)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:5001/api/auth/signup", formData)
      navigate("/login")
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message)
      setError(error.response?.data?.message || "Signup failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavigationBar />
      <div className="pt-16">
        <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${"/src/assets/img/volunteers-helping-with-donation.jpg"})`,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backgroundBlendMode: "multiply",
              }}
            />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Heart className="mr-2 h-6 w-6" /> CharityHub
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  "Join our community of changemakers and help make a difference in the world. Your journey to creating
                  positive change starts here."
                </p>
                <footer className="text-sm">Sofia Davis - Community Manager</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] bg-white p-8 rounded-xl shadow-lg">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-primary">Create an account</h1>
                <p className="text-sm text-muted-foreground">Join our community and start making a difference today</p>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between mb-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    1
                  </div>
                  <span className="text-xs mt-1">Personal Info</span>
                </div>
                <div className="flex-1 flex items-center">
                  <div className={`h-1 w-full ${currentStep >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    2
                  </div>
                  <span className="text-xs mt-1">Account Details</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="grid gap-6">
                <form className="space-y-4" onSubmit={handleSignUp}>
                  {currentStep === 1 ? (
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          type="text"
                          placeholder="Dupont"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input
                          id="prenom"
                          type="text"
                          placeholder="Jean"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="30"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="adresse">Adresse</Label>
                        <Input
                          id="adresse"
                          type="text"
                          placeholder="123 Rue de la Paix, 75000 Paris"
                          value={formData.adresse}
                          onChange={handleChange}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-primary hover:bg-primary/90 transition-colors mt-4"
                      >
                        Continue
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="telephone">Numéro de téléphone</Label>
                        <Input
                          id="telephone"
                          type="tel"
                          placeholder="+33 1 23 45 67 89"
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-3 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevStep}
                          className="flex-1 hover:bg-gray-50 transition-colors border-gray-200"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 transition-colors">
                          S'inscrire
                        </Button>
                      </div>
                    </div>
                  )}
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-muted-foreground font-medium">Ou continuer avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="hover:bg-gray-50 transition-colors border-gray-200">
                    <Github className="mr-2 h-4 w-4" /> Github
                  </Button>
                  <Button variant="outline" className="hover:bg-gray-50 transition-colors border-gray-200">
                    <Mail className="mr-2 h-4 w-4" /> Google
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Join a community of passionate volunteers making real change
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">Connect with local and global charity initiatives</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">Track your impact and contributions over time</p>
                  </div>
                </div>

                <p className="px-8 text-center text-sm text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/login" className="underline underline-offset-4 hover:text-primary transition-colors">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp

