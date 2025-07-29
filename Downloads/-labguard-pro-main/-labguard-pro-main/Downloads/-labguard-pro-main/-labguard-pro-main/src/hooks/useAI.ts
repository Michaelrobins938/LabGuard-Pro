import { useState, useCallback } from 'react'
import { apiService } from '@/lib/api'

interface AIRequest {
  prompt: string
  context?: string
  maxTokens?: number
  temperature?: number
  model?: string
}

interface AIResponse {
  text: string
  confidence: number
  tokens: number
  model: string
}

interface UseAIReturn {
  generateResponse: (request: AIRequest) => Promise<string>
  analyzeText: (text: string) => Promise<any>
  isProcessing: boolean
  error: string | null
}

export function useAI(): UseAIReturn {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateResponse = useCallback(async (request: AIRequest): Promise<string> => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          context: request.context || 'You are a helpful laboratory assistant.',
          maxTokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7,
          model: request.model || 'gpt-4'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate AI response')
      }

      const data = await response.json()
      return data.text
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate AI response'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const analyzeText = useCallback(async (text: string): Promise<any> => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          analysisType: 'general'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze text')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze text'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    generateResponse,
    analyzeText,
    isProcessing,
    error
  }
} 