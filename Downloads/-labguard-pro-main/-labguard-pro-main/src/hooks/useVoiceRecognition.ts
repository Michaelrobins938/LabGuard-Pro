import { useState, useEffect, useCallback } from 'react'

interface UseVoiceRecognitionReturn {
  transcript: string
  isListening: boolean
  isSupported: boolean
  startListening: () => Promise<void>
  stopListening: () => Promise<void>
  resetTranscript: () => void
  error: string | null
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<any>(null)

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognitionInstance = new SpeechRecognition()
      
      // Configure recognition settings
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'
      recognitionInstance.maxAlternatives = 1
      
      // Set up event handlers
      recognitionInstance.onstart = () => {
        setIsListening(true)
        setError(null)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(finalTranscript || interimTranscript)
      }
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setError(event.error)
        setIsListening(false)
      }
      
      recognitionInstance.onnomatch = () => {
        setError('No speech was recognized')
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
      setError('Speech recognition is not supported in this browser')
    }
  }, [])

  const startListening = useCallback(async () => {
    if (!recognition) {
      throw new Error('Speech recognition not available')
    }
    
    if (!isSupported) {
      throw new Error('Speech recognition is not supported in this browser')
    }
    
    try {
      setError(null)
      setTranscript('')
      await recognition.start()
    } catch (err) {
      console.error('Failed to start listening:', err)
      setError('Failed to start listening')
      throw err
    }
  }, [recognition, isSupported])

  const stopListening = useCallback(async () => {
    if (!recognition) {
      return
    }
    
    try {
      await recognition.stop()
    } catch (err) {
      console.error('Failed to stop listening:', err)
      setError('Failed to stop listening')
      throw err
    }
  }, [recognition])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error
  }
} 