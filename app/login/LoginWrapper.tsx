"use client"

import { Zap } from "lucide-react"
import { LoginForm } from "@/components/LoginForm"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function LoginWrapper() {
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
    } catch (error: any) {
      throw error
    }
  }

  const handleError = () => {
    toast.error("Incorrect email or password. Please try again.")
  }

  return (
    <div className="min-h-screen relative">
      {/* Mobile Background - Full screen gradient */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-[#31CDFF] to-blue-600">
        <div className="absolute inset-0 pattern-dots pattern-blue-500 pattern-bg-transparent pattern-opacity-10 pattern-size-4" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Gradient Background */}
        <div className="relative bg-gradient-to-br from-[#31CDFF] to-blue-600">
          <div className="absolute inset-0 pattern-dots pattern-blue-500 pattern-bg-transparent pattern-opacity-20 pattern-size-4" />
          <div className="relative h-full flex flex-col justify-between p-12 text-white">
            <Zap className="w-12 h-12" />
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">BQI Tech Portal</h2>
              <p className="text-lg opacity-90">
                Empowering innovation through secure access
              </p>
            </div>
            <div className="flex gap-4 opacity-75">
              <span className="text-sm">v2.4.0</span>
              <span className="text-sm">•</span>
              <span className="text-sm">Secure Login</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex items-center justify-center p-8 bg-background">
          <div className="relative z-10 bg-background p-8 rounded-lg shadow-2xl w-full max-w-md">
            <LoginForm onLogin={handleLogin} onError={handleError} />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10 min-h-screen flex flex-col">
        {/* Mobile Header with Branding */}
        <div className="flex-shrink-0 pt-8 pb-4 px-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <Zap className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">BQI Tech Portal</h1>
          <p className="text-sm opacity-90">Secure access to your account</p>
        </div>

        {/* Mobile Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
            <LoginForm onLogin={handleLogin} onError={handleError} />
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="flex-shrink-0 pb-6 px-8 text-center">
          <div className="flex justify-center gap-4 text-white/75 text-xs">
            <span>v2.4.0</span>
            <span>•</span>
            <span>Secure Login</span>
          </div>
        </div>
      </div>
    </div>
  )
} 