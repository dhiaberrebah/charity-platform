import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Github, Mail, Heart } from "lucide-react";
import NavigationBar from "../components/NavigationBar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: "",
    adresse: "",
    telephone: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/auth/signup", formData);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

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
                <p className="text-sm text-muted-foreground">
                  Enter your information below to create your account
                </p>
              </div>
              <div className="grid gap-6">
                <form className="space-y-4" onSubmit={handleSignUp}>
                  <div className="grid gap-4">
                    {[
                      { id: "nom", label: "Nom", type: "text", placeholder: "Dupont" },
                      { id: "prenom", label: "Prénom", type: "text", placeholder: "Jean" },
                      { id: "age", label: "Age", type: "number", placeholder: "30" },
                      { id: "adresse", label: "Adresse", type: "text", placeholder: "123 Rue de la Paix, 75000 Paris" },
                      { id: "telephone", label: "Numéro de téléphone", type: "tel", placeholder: "+33 1 23 45 67 89" },
                      { id: "email", label: "Email", type: "email", placeholder: "name@example.com" },
                    ].map(({ id, label, type, placeholder }) => (
                      <div key={id} className="grid gap-2">
                        <Label htmlFor={id}>{label}</Label>
                        <Input id={id} type={type} placeholder={placeholder} value={formData[id]} onChange={handleChange} required />
                      </div>
                    ))}

                    <div className="grid gap-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
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
                    </div>

                    <Button type="submit" className="w-full">S'inscrire</Button>
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
  );
};

export default SignUp;
