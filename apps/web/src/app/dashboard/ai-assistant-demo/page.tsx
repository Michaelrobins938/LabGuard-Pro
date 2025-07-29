'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AIAssistantDemoPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new standalone AI demo page
    router.replace('/ai-demo')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to AI Demo...</p>
      </div>
    </div>
  )
} 