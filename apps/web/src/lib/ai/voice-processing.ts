// Enhanced Voice Processing Service for Laboratory AI Assistant
// Supports voice commands, dictation, and voice feedback

import React, { useState, useMemo, useCallback, useEffect } from 'react';

export interface VoiceProcessingConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  confidence: number;
  enableNoiseCancellation: boolean;
  enableVoiceFeedback: boolean;
  voiceType?: 'male' | 'female' | 'neutral';
  speechRate?: number;
  pitch?: number;
  volume?: number;
}

export interface VoiceProcessingResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives: TranscriptAlternative[];
  timestamp: number;
  duration?: number;
}

export interface TranscriptAlternative {
  transcript: string;
  confidence: number;
}

export interface VoiceCommand {
  command: string;
  parameters?: Record<string, any>;
  confidence: number;
  executed?: boolean;
}

// Add proper type checking for browser APIs
export class VoiceProcessingService {
  private synthesis: SpeechSynthesis | null = null
  private recognition: SpeechRecognition | null = null
  private commandHandlers: Map<string, (params?: any) => Promise<any>> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis
      this.recognition = new (window as any).SpeechRecognition()
      this.setupRecognition()
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
      
      this.processVoiceCommand(transcript)
    }
  }

  speak(text: string, options: any = {}) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not available')
      return
    }

    const voices = this.synthesis.getVoices()
    const utterance = new SpeechSynthesisUtterance(text)
    
    if (voices.length > 0) {
      utterance.voice = voices[0]
    }
    
    utterance.rate = options.rate || 1
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1
    
    this.synthesis.speak(utterance)
  }

  startListening() {
    if (!this.recognition) {
      console.warn('Speech recognition not available')
      return
    }
    
    this.recognition.start()
  }

  stopListening() {
    if (!this.recognition) return
    this.recognition.stop()
  }

  stopSpeaking() {
    if (!this.synthesis) return
    this.synthesis.cancel()
  }

  private async processVoiceCommand(transcript: string) {
    const commands = Array.from(this.commandHandlers.entries())
    
    for (const [trigger, handler] of commands) {
      if (transcript.toLowerCase().includes(trigger.toLowerCase())) {
        try {
          await handler(transcript)
        } catch (error) {
          console.error('Error processing voice command:', error)
        }
      }
    }
  }

  registerCommand(trigger: string, handler: (params?: any) => Promise<any>) {
    this.commandHandlers.set(trigger, handler)
  }

  unregisterCommand(trigger: string) {
    this.commandHandlers.delete(trigger)
  }
}

// Fix the hook with proper React imports
export function useVoiceProcessing(config?: Partial<VoiceProcessingConfig>) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastTranscript, setLastTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voiceService = useMemo(() => new VoiceProcessingService(), []);

  useEffect(() => {
    // Check for speech recognition support
    if (typeof window !== 'undefined') {
      const hasSupport = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
      setIsSupported(hasSupport);
    }
  }, []);

  const startListening = useCallback(async () => {
    try {
      setIsListening(true);
      await voiceService.startListening();
    } catch (err: any) {
      setError(err.message);
      setIsListening(false);
    }
  }, [voiceService]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
  }, [voiceService]);

  const speak = useCallback(async (text: string, options?: any) => {
    try {
      setIsSpeaking(true);
      await voiceService.speak(text, options);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSpeaking(false);
    }
  }, [voiceService]);

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  }, [voiceService]);

  return {
    isListening,
    isSpeaking,
    audioLevel,
    lastTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    voiceService
  };
}

export default VoiceProcessingService; 