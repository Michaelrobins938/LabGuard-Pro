'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2 } from 'lucide-react'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { useAI } from '@/hooks/useAI'

interface VoiceAssistantProps {
  onCommand?: (command: string) => void
  onResponse?: (response: string) => void
  className?: string
}

export function VoiceAssistant({ onCommand, onResponse, className }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([])

  const { startListening, stopListening, transcript: voiceTranscript, isListening: voiceIsListening } = useVoiceRecognition()
  const { speak, stopSpeaking, isSpeaking: ttsIsSpeaking } = useTextToSpeech()
  const { generateResponse } = useAI()

  const audioRef = useRef<HTMLAudioElement>(null)

  // Handle voice recognition
  useEffect(() => {
    if (voiceTranscript && voiceTranscript !== transcript) {
      setTranscript(voiceTranscript)
    }
  }, [voiceTranscript, transcript])

  // Handle listening state
  useEffect(() => {
    setIsListening(voiceIsListening)
  }, [voiceIsListening])

  // Handle speaking state
  useEffect(() => {
    setIsSpeaking(ttsIsSpeaking)
  }, [ttsIsSpeaking])

  const handleStartListening = async () => {
    try {
      await startListening()
      setTranscript('')
      setResponse('')
    } catch (error) {
      console.error('Failed to start listening:', error)
    }
  }

  const handleStopListening = async () => {
    try {
      await stopListening()
      if (transcript.trim()) {
        await processCommand(transcript)
      }
    } catch (error) {
      console.error('Failed to stop listening:', error)
    }
  }

  const handleTextSubmit = async () => {
    if (transcript.trim()) {
      await processCommand(transcript)
    }
  }

  const processCommand = async (command: string) => {
    setIsProcessing(true)
    
    try {
      // Add user command to history
      const userMessage = {
        type: 'user' as const,
        content: command,
        timestamp: new Date()
      }
      
      setConversationHistory(prev => [...prev, userMessage])
      
      // Generate AI response
      const aiResponse = await generateResponse({
        prompt: command,
        context: 'You are a helpful laboratory assistant. Provide clear, concise responses.',
        maxTokens: 500
      })
      
      setResponse(aiResponse)
      
      // Add AI response to history
      const assistantMessage = {
        type: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date()
      }
      
      setConversationHistory(prev => [...prev, assistantMessage])
      
      // Speak the response
      await speak(aiResponse)
      
      // Call callbacks
      onCommand?.(command)
      onResponse?.(aiResponse)
      
    } catch (error) {
      console.error('Failed to process command:', error)
      setResponse('Sorry, I encountered an error processing your request.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStopSpeaking = () => {
    stopSpeaking()
  }

  const handleClearHistory = () => {
    setConversationHistory([])
    setTranscript('')
    setResponse('')
  }

  const getStatusColor = () => {
    if (isProcessing) return 'bg-yellow-500'
    if (isListening) return 'bg-red-500'
    if (isSpeaking) return 'bg-green-500'
    return 'bg-gray-500'
  }

  const getStatusText = () => {
    if (isProcessing) return 'Processing...'
    if (isListening) return 'Listening...'
    if (isSpeaking) return 'Speaking...'
    return 'Ready'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
          Voice Assistant
          <Badge variant="secondary">{getStatusText()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={isProcessing || isSpeaking}
            className="w-16 h-16 rounded-full"
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>
          
          <Button
            size="lg"
            variant={isSpeaking ? "destructive" : "outline"}
            onClick={isSpeaking ? handleStopSpeaking : undefined}
            disabled={!isSpeaking}
            className="w-16 h-16 rounded-full"
          >
            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </Button>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">You said:</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-gray-900">{transcript}</p>
              <Button
                size="sm"
                onClick={handleTextSubmit}
                disabled={isProcessing}
                className="mt-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send
              </Button>
            </div>
          </div>
        )}

        {/* AI Response */}
        {response && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Assistant:</label>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-900">{response}</p>
            </div>
          </div>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Conversation History</label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearHistory}
              >
                Clear
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {conversationHistory.slice(-6).map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {message.type === 'user' ? 'You' : 'Assistant'}:
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Commands */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quick Commands:</label>
          <div className="flex flex-wrap gap-2">
            {[
              'Check equipment status',
              'Start calibration',
              'Generate report',
              'Show alerts',
              'Help'
            ].map((command) => (
              <Button
                key={command}
                size="sm"
                variant="outline"
                onClick={() => setTranscript(command)}
                disabled={isProcessing}
              >
                {command}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 