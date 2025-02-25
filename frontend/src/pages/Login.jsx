import { lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import NavigationBar from "../components/NavigationBar"

const LoginForm = lazy(() => import("../components/LoginForm.jsx"))

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="pt-16">
        <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${"/src/assets/img/happy-volunteers-cooperating-while-packing-donation.jpg"})`,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backgroundBlendMode: "multiply",
              }}
            />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Heart className="mr-2 h-6 w-6" /> CharityHub
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">"The best way to find yourself is to lose yourself in the service of others."</p>
                <footer className="text-sm">Mahatma Gandhi</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
              </Suspense>
              <p className="px-8 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

