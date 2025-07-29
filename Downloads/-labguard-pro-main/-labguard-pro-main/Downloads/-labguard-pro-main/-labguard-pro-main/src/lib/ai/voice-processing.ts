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
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private config: VoiceProcessingConfig;
  private isListening: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private commandHandlers: Map<string, (params?: any) => Promise<any>>;
  
  constructor(config: Partial<VoiceProcessingConfig> = {}) {
    this.config = {
      language: 'en-US',
      continuous: false,
      interimResults: true,
      maxAlternatives: 3,
      confidence: 0.7,
      enableNoiseCancellation: true,
      enableVoiceFeedback: true,
      voiceType: 'neutral',
      speechRate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      ...config
    };
    
    this.commandHandlers = new Map();
    this.initializeRecognition();
    this.initializeSynthesis();
    this.registerDefaultCommands();
  }

  private initializeRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.lang = this.config.language;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const latest = event.results[event.resultIndex];
      if (latest && latest.length > 0) {
        const transcript = latest[0].transcript;
        const confidence = latest[0].confidence;
        const isFinal = latest.isFinal;

        const alternatives = Array.from(latest).slice(1).map((alt: any) => ({
          transcript: alt.transcript,
          confidence: alt.confidence
        }));

        const result: VoiceProcessingResult = {
          transcript,
          confidence,
          isFinal,
          alternatives,
          timestamp: Date.now()
        };

        this.handleRecognitionResult(result);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      this.handleRecognitionError(event);
    };

    this.recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      this.isListening = true;
    };

    this.recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
      this.isListening = false;
    };
  }

  private initializeSynthesis() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private registerDefaultCommands() {
    // Equipment commands
    this.registerCommand('start equipment', async (params) => {
      return { action: 'start_equipment', params };
    });
    
    this.registerCommand('stop equipment', async (params) => {
      return { action: 'stop_equipment', params };
    });
    
    this.registerCommand('check status', async (params) => {
      return { action: 'check_status', params };
    });
    
    // Protocol commands
    this.registerCommand('start protocol', async (params) => {
      return { action: 'start_protocol', params };
    });
    
    this.registerCommand('next step', async () => {
      return { action: 'next_step' };
    });
    
    this.registerCommand('previous step', async () => {
      return { action: 'previous_step' };
    });
    
    // Data commands
    this.registerCommand('record data', async (params) => {
      return { action: 'record_data', params };
    });
    
    this.registerCommand('analyze results', async () => {
      return { action: 'analyze_results' };
    });
    
    // Navigation commands
    this.registerCommand('go to dashboard', async () => {
      return { action: 'navigate', target: 'dashboard' };
    });
    
    this.registerCommand('open settings', async () => {
      return { action: 'navigate', target: 'settings' };
    });
  }

  // Start voice recognition
  async startListening(): Promise<void> {
    if (this.isListening || !this.recognition) {
      console.warn('Voice recognition is already active or not available');
      return;
    }

    try {
      // Request microphone permission
      await this.requestMicrophoneAccess();
      
      // Start recognition
      this.recognition.start();
      
      // Start audio level monitoring
      await this.startAudioLevelMonitoring();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      throw error;
    }
  }

  // Stop voice recognition
  stopListening(): void {
    if (!this.isListening || !this.recognition) return;
    
    this.recognition.stop();
    this.stopAudioLevelMonitoring();
  }

  // Text-to-speech
  async speak(text: string, options?: Partial<SpeechSynthesisUtterance>): Promise<void> {
    if (!this.synthesis || !this.config.enableVoiceFeedback) return;

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice
      utterance.lang = this.config.language;
      utterance.rate = options?.rate || this.config.speechRate || 1.0;
      utterance.pitch = options?.pitch || this.config.pitch || 1.0;
      utterance.volume = options?.volume || this.config.volume || 1.0;
      
      // Select voice
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes(this.config.language.split('-')[0])
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);
      
      this.synthesis.speak(utterance);
    });
  }

  // Stop speech
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Register voice command
  registerCommand(trigger: string, handler: (params?: any) => Promise<any>): void {
    this.commandHandlers.set(trigger.toLowerCase(), handler);
  }

  // Process voice input
  private async handleRecognitionResult(result: VoiceProcessingResult): Promise<void> {
    console.log('🎤 Recognition result:', result);
    
    if (result.confidence < this.config.confidence) {
      console.log('Low confidence, ignoring result');
      return;
    }
    
    // Check for commands
    const command = await this.parseCommand(result.transcript);
    if (command) {
      await this.executeCommand(command);
    }
    
    // Emit result event
    this.emitEvent('voiceResult', result);
  }

  // Parse command from transcript
  private async parseCommand(transcript: string): Promise<VoiceCommand | null> {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Check for exact matches
    for (const [trigger, handler] of this.commandHandlers) {
      if (lowerTranscript.includes(trigger)) {
        // Extract parameters
        const params = this.extractCommandParameters(lowerTranscript, trigger);
        
        return {
          command: trigger,
          parameters: params,
          confidence: 1.0
        };
      }
    }
    
    // Use NLP for fuzzy matching (mock implementation)
    const nlpResult = await this.analyzeWithNLP(transcript);
    if (nlpResult && nlpResult.intent && this.commandHandlers.has(nlpResult.intent)) {
      return {
        command: nlpResult.intent,
        parameters: nlpResult.entities,
        confidence: nlpResult.confidence
      };
    }
    
    return null;
  }

  // Execute command
  private async executeCommand(command: VoiceCommand): Promise<void> {
    const handler = this.commandHandlers.get(command.command);
    if (!handler) return;
    
    try {
      const result = await handler(command.parameters);
      command.executed = true;
      
      // Provide voice feedback
      if (this.config.enableVoiceFeedback) {
        await this.speak(`Command ${command.command} executed successfully`);
      }
      
      this.emitEvent('commandExecuted', { command, result });
    } catch (error) {
      console.error('Failed to execute command:', error);
      
      if (this.config.enableVoiceFeedback) {
        await this.speak(`Failed to execute command ${command.command}`);
      }
    }
  }

  // Extract command parameters
  private extractCommandParameters(transcript: string, trigger: string): Record<string, any> {
    const afterTrigger = transcript.split(trigger)[1]?.trim();
    if (!afterTrigger) return {};
    
    // Simple parameter extraction (can be enhanced with NLP)
    const params: Record<string, any> = {};
    
    // Extract numbers
    const numbers = afterTrigger.match(/\d+/g);
    if (numbers) {
      params.values = numbers.map(n => parseInt(n));
    }
    
    // Extract quoted strings
    const quoted = afterTrigger.match(/"([^"]+)"/g);
    if (quoted) {
      params.strings = quoted.map(q => q.replace(/"/g, ''));
    }
    
    // Extract remaining text
    params.text = afterTrigger;
    
    return params;
  }

  // NLP analysis (mock implementation)
  private async analyzeWithNLP(transcript: string): Promise<any> {
    // In a real implementation, this would use a proper NLP service
    return null;
  }

  // Handle recognition errors
  private handleRecognitionError(event: SpeechRecognitionErrorEvent): void {
    const errorMessages: Record<string, string> = {
      'no-speech': 'No speech detected',
      'audio-capture': 'Audio capture failed',
      'not-allowed': 'Microphone access denied',
      'network': 'Network error occurred'
    };
    
    const message = errorMessages[event.error] || 'Unknown error occurred';
    this.emitEvent('error', { message, error: event.error });
  }

  // Request microphone access
  private async requestMicrophoneAccess(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return this.stream;
    } catch (error) {
      throw new Error('Microphone access denied');
    }
  }

  // Audio level monitoring
  private async startAudioLevelMonitoring(): Promise<void> {
    if (!this.stream) return;
    
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    
    const source = this.audioContext.createMediaStreamSource(this.stream);
    source.connect(this.analyser);
    
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkLevel = () => {
      if (!this.isListening) return;
      
      this.analyser!.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;
      
      this.emitEvent('audioLevel', { level: normalizedLevel });
      
      requestAnimationFrame(checkLevel);
    };
    
    checkLevel();
  }

  // Stop audio level monitoring
  private stopAudioLevelMonitoring(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Event emitter
  private emitEvent(eventName: string, data: any): void {
    // In a real implementation, this would use a proper event emitter
    console.log(`Event: ${eventName}`, data);
  }

  // Configuration
  updateConfig(newConfig: Partial<VoiceProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.recognition) {
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.lang = this.config.language;
      this.recognition.maxAlternatives = this.config.maxAlternatives;
    }
  }

  getConfig(): VoiceProcessingConfig {
    return { ...this.config };
  }

  isRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && 
           !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  isSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && !!window.speechSynthesis;
  }

  getIsListening(): boolean {
    return this.isListening;
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

  const voiceService = useMemo(() => new VoiceProcessingService(config), []);

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