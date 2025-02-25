"use client"

import { useState } from "react"
import { Eye, EyeOff, Github, Mail } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Checkbox } from "./ui/checkbox"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid gap-6">
      <form>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="name@example.com" type="email" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} required />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button className="w-full">Sign In</Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
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
    </div>
  )
}

export default LoginForm

