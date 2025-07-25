'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Mail, Shield, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link. Please check your email for the correct link.')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.error || 'Email verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred during email verification')
    }
  }

  const resendVerification = async () => {
    // This would require the user to enter their email again
    // For now, redirect to login
    router.push('/auth/login?message=Please log in to resend verification email')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.02&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home Link */}
        <div className="flex justify-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Email Verification
          </h2>
        </motion.div>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-white mb-2">
              {status === 'loading' && 'Verifying your email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h3>
            <p className="text-gray-300">
              {status === 'loading' && 'Please wait while we verify your email address'}
              {status === 'success' && 'Your email has been successfully verified'}
              {status === 'error' && 'There was an issue verifying your email'}
            </p>
          </div>

          <div className="space-y-6">
            {status === 'loading' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center py-8"
              >
                <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                <p className="text-gray-300">{message}</p>
                <Link href="/auth/login">
                  <button className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-teal-500/25 transform hover:scale-[1.02]">
                    Continue to Login
                  </button>
                </Link>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <XCircle className="w-16 h-16 text-red-400 mx-auto" />
                <p className="text-gray-300">{message}</p>
                <div className="space-y-3">
                  <button 
                    onClick={resendVerification} 
                    className="w-full py-3 px-4 border border-white/20 rounded-xl text-white bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    Resend Verification Email
                  </button>
                  <Link href="/auth/login">
                    <button className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-teal-500/25 transform hover:scale-[1.02]">
                      Back to Login
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 