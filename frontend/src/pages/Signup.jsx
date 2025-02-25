"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Github, Mail, Heart, Upload } from "lucide-react"
import NavigationBar from "../components/NavigationBar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [cinPhoto, setCinPhoto] = useState(null)

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "" }
    if (password.length < 6) return { strength: 25, label: "Weak" }

    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25

    let label = ""
    if (strength <= 25) label = "Weak"
    else if (strength <= 50) label = "Fair"
    else if (strength <= 75) label = "Good"
    else label = "Strong"

    return { strength, label }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setCinPhoto(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="pt-16">
        <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-primary" />
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
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">Enter your information below to create your account</p>
              </div>
              <div className="grid gap-6">
                <form>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input id="nom" placeholder="Dupont" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input id="prenom" placeholder="Jean" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" placeholder="30" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="adresse">Adresse</Label>
                      <Input id="adresse" placeholder="123 Rue de la Paix, 75000 Paris" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="telephone">Numéro de téléphone</Label>
                      <Input id="telephone" type="tel" placeholder="+33 1 23 45 67 89" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" placeholder="name@example.com" type="email" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {password && (
                        <div className="space-y-2">
                          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrength.strength <= 25
                                  ? "bg-red-500"
                                  : passwordStrength.strength <= 50
                                    ? "bg-yellow-500"
                                    : passwordStrength.strength <= 75
                                      ? "bg-blue-500"
                                      : "bg-green-500"
                              }`}
                              style={{ width: `${passwordStrength.strength}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-600">Force du mot de passe: {passwordStrength.label}</p>
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cinphoto">Photo CIN</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="cinphoto"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("cinphoto").click()}
                        >
                          <Upload className="mr-2 h-4 w-4" /> Télécharger la photo
                        </Button>
                        {cinPhoto && <span className="text-sm text-gray-600">{cinPhoto.name}</span>}
                      </div>
                    </div>
                    <Button className="w-full">S'inscrire</Button>
                  </div>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-50 px-2 text-muted-foreground">Ou continuer avec</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Github className="mr-2 h-4 w-4" /> Github
                  </Button>
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" /> Google
                  </Button>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/login" className="underline underline-offset-4 hover:text-primary">
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

