import { useState, useEffect, useCallback } from 'react'

interface UseTextToSpeechReturn {
  isSpeaking: boolean
  isSupported: boolean
  speak: (text: string) => Promise<void>
  stopSpeaking: () => void
  pauseSpeaking: () => void
  resumeSpeaking: () => void
  error: string | null
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [speechSynthesis, setSpeechSynthesis] = useState<any>(null)
  const [currentUtterance, setCurrentUtterance] = useState<any>(null)

  // Check if speech synthesis is supported
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true)
      setSpeechSynthesis(window.speechSynthesis)
    } else {
      setIsSupported(false)
      setError('Speech synthesis is not supported in this browser')
    }
  }, [])

  const speak = useCallback(async (text: string) => {
    if (!speechSynthesis) {
      throw new Error('Speech synthesis not available')
    }

    if (!isSupported) {
      throw new Error('Speech synthesis is not supported in this browser')
    }

    try {
      setError(null)
      
      // Stop any current speech
      if (currentUtterance) {
        speechSynthesis.cancel()
      }

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Configure speech settings
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = 'en-US'
      
      // Set up event handlers
      utterance.onstart = () => {
        setIsSpeaking(true)
        setCurrentUtterance(utterance)
      }
      
      utterance.onend = () => {
        setIsSpeaking(false)
        setCurrentUtterance(null)
      }
      
      utterance.onerror = (event: any) => {
        console.error('Speech synthesis error:', event.error)
        setError(event.error)
        setIsSpeaking(false)
        setCurrentUtterance(null)
      }
      
      // Start speaking
      speechSynthesis.speak(utterance)
      
    } catch (err) {
      console.error('Failed to speak:', err)
      setError('Failed to speak text')
      throw err
    }
  }, [speechSynthesis, isSupported, currentUtterance])

  const stopSpeaking = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentUtterance(null)
    }
  }, [speechSynthesis])

  const pauseSpeaking = useCallback(() => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.pause()
    }
  }, [speechSynthesis, isSpeaking])

  const resumeSpeaking = useCallback(() => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.resume()
    }
  }, [speechSynthesis, isSpeaking])

  return {
    isSpeaking,
    isSupported,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    error
  }
} 