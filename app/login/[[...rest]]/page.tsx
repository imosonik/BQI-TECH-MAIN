"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginWrapper from '../LoginWrapper'
import { toast } from 'sonner'
import Link from 'next/link'
import { ChevronLeft, Home } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function LoginPage() {
  const { isAuthenticated, authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false)

  useEffect(() => {
    // Check for success message from logout
    const message = searchParams.get('message')
    if (message === 'Successfully logged out') {
      setShowLogoutSuccess(true)
      // Clear the query parameter to avoid showing the message on refresh
      router.replace('/login')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirectTo || '/dashboard')
    }
  }, [isAuthenticated, authLoading, redirectTo, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Compact Back to Home Button - Top Left Corner */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300 hover:border-blue-400 rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-blue-600 font-medium text-sm transition-all duration-200 group"
        >
          <Home className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
          <span className="font-semibold">Home</span>
        </Link>
      </div>
      {/* Fixed-position alert for logout success */}
      {showLogoutSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert className="shadow-lg">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              You have successfully logged out.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <LoginWrapper />
    </div>
  )
} 