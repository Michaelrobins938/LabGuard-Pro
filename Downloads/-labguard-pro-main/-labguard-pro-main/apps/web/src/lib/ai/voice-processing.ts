// Enhanced Voice Processing Service for Laboratory AI Assistant
// Supports speech-to-text, text-to-speech, and laboratory terminology recognition

export interface VoiceProcessingConfig {
  language: string;
  sampleRate: number;
  enableNoiseSuppression: boolean;
  enableEchoCancellation: boolean;
  enableAutoGainControl: boolean;
  laboratoryTerminologyEnabled: boolean;
  continuousListening: boolean;
  voiceCommands: boolean;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: Array<{
    transcript: string;
    confidence: number;
  }>;
  laboratoryTerms?: Array<{
    term: string;
    definition: string;
    category: string;
  }>;
  suggestedActions?: string[];
}

export interface VoiceSynthesisOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
  laboratoryMode?: boolean;
}

export interface VoiceCommand {
  command: string;
  aliases: string[];
  action: string;
  description: string;
  category: 'analysis' | 'protocol' | 'equipment' | 'navigation' | 'general';
  parameters?: string[];
}

class VoiceProcessingService {
  private config: VoiceProcessingConfig;
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isListening: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private eventListeners: Map<string, Set<Function>> = new Map();
  
  // Laboratory terminology dictionary
  private laboratoryTerms: Map<string, { definition: string; category: string; pronunciation?: string }> = new Map();
  
  // Voice commands for laboratory operations
  private voiceCommands: VoiceCommand[] = [];

  constructor(config: Partial<VoiceProcessingConfig> = {}) {
    this.config = {
      language: 'en-US',
      sampleRate: 16000,
      enableNoiseSuppression: true,
      enableEchoCancellation: true,
      enableAutoGainControl: true,
      laboratoryTerminologyEnabled: true,
      continuousListening: false,
      voiceCommands: true,
      ...config
    };

    this.initializeServices();
    this.loadLaboratoryTerminology();
    this.setupVoiceCommands();
  }

  // Initialize speech recognition and synthesis
  private initializeServices() {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = this.config.continuousListening;
      this.recognition.interimResults = true;
      this.recognition.lang = this.config.language;
      this.recognition.maxAlternatives = 3;

      this.setupRecognitionHandlers();
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  // Setup speech recognition event handlers
  private setupRecognitionHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.emit('listening-start');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.emit('listening-end');
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = Array.from(event.results);
      const latest = results[results.length - 1];
      
      if (latest) {
        const transcript = latest[0].transcript;
        const confidence = latest[0].confidence;
        const isFinal = latest.isFinal;

        const result: SpeechRecognitionResult = {
          transcript,
          confidence,
          isFinal,
          alternatives: Array.from(latest).slice(1).map(alt => ({
            transcript: alt.transcript,
            confidence: alt.confidence
          }))
        };

        // Process laboratory terminology
        if (this.config.laboratoryTerminologyEnabled) {
          result.laboratoryTerms = this.identifyLaboratoryTerms(transcript);
        }

        // Process voice commands
        if (this.config.voiceCommands) {
          const command = this.recognizeVoiceCommand(transcript);
          if (command) {
            this.emit('voice-command', { command, transcript });
            return;
          }
        }

        this.emit('speech-result', result);
        
        if (isFinal) {
          this.emit('speech-final', result);
        }
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.emit('speech-error', { 
        error: event.error, 
        message: event.message 
      });
    };
  }

  // Start speech recognition
  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      return;
    }

    try {
      // Request microphone permission
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: this.config.sampleRate,
          noiseSuppression: this.config.enableNoiseSuppression,
          echoCancellation: this.config.enableEchoCancellation,
          autoGainControl: this.config.enableAutoGainControl
        }
      });

      // Setup audio analysis for visual feedback
      this.setupAudioAnalysis();

      this.recognition.start();
    } catch (error) {
      throw new Error(`Failed to start listening: ${error}`);
    }
  }

  // Stop speech recognition
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  // Speak text using text-to-speech
  async speak(text: string, options: VoiceSynthesisOptions = {}): Promise<void> {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      // Cancel any current speech
      this.synthesis!.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice options
      const voices = this.synthesis!.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name === options.voice || 
        voice.lang === (options.language || this.config.language)
      ) || voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.language || this.config.language;

      // Process laboratory terminology for better pronunciation
      if (options.laboratoryMode && this.config.laboratoryTerminologyEnabled) {
        utterance.text = this.enhanceTextForLaboratory(text);
      }

      utterance.onstart = () => {
        this.currentUtterance = utterance;
        this.emit('speech-start', { text });
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.emit('speech-end', { text });
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        this.emit('speech-error', { error: event.error, text });
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synthesis!.speak(utterance);
    });
  }

  // Stop current speech synthesis
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  // Setup audio analysis for visual feedback
  private setupAudioAnalysis(): void {
    if (!this.mediaStream) return;

    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.analyser = this.audioContext.createAnalyser();
    
    this.analyser.fftSize = 256;
    source.connect(this.analyser);

    // Start audio level monitoring
    this.monitorAudioLevel();
  }

  // Monitor audio input level for visual feedback
  private monitorAudioLevel(): void {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateLevel = () => {
      if (!this.analyser || !this.isListening) return;

      this.analyser.getByteFrequencyData(dataArray);
      
      // Calculate average audio level
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;

      this.emit('audio-level', { level: normalizedLevel });

      requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }

  // Load laboratory terminology dictionary
  private loadLaboratoryTerminology(): void {
    const terms = [
      // Molecular Biology
      { term: 'PCR', definition: 'Polymerase Chain Reaction', category: 'molecular_biology', pronunciation: 'P-C-R' },
      { term: 'DNA', definition: 'Deoxyribonucleic Acid', category: 'molecular_biology' },
      { term: 'RNA', definition: 'Ribonucleic Acid', category: 'molecular_biology' },
      { term: 'CRISPR', definition: 'Clustered Regularly Interspaced Short Palindromic Repeats', category: 'molecular_biology' },
      { term: 'FASTA', definition: 'Fast Adaptive Shrinkage/Thresholding Algorithm', category: 'bioinformatics' },
      { term: 'FASTQ', definition: 'FASTA with Quality scores', category: 'bioinformatics' },
      
      // Equipment
      { term: 'centrifuge', definition: 'Device for separating components by spinning', category: 'equipment' },
      { term: 'spectrophotometer', definition: 'Instrument for measuring light absorption', category: 'equipment' },
      { term: 'microscope', definition: 'Instrument for magnifying small objects', category: 'equipment' },
      { term: 'incubator', definition: 'Temperature-controlled chamber for cell culture', category: 'equipment' },
      
      // Techniques
      { term: 'electrophoresis', definition: 'Separation technique using electric field', category: 'technique' },
      { term: 'chromatography', definition: 'Separation technique using differential migration', category: 'technique' },
      { term: 'cell culture', definition: 'Growing cells outside their natural environment', category: 'technique' },
      { term: 'protein purification', definition: 'Isolation of specific proteins', category: 'technique' },
      
      // Units and Measurements
      { term: 'microliter', definition: 'One millionth of a liter', category: 'measurement', pronunciation: 'micro-liter' },
      { term: 'nanometer', definition: 'One billionth of a meter', category: 'measurement', pronunciation: 'nano-meter' },
      { term: 'molarity', definition: 'Concentration measure in moles per liter', category: 'measurement' },
      { term: 'pH', definition: 'Measure of acidity or alkalinity', category: 'measurement', pronunciation: 'P-H' }
    ];

    terms.forEach(term => {
      this.laboratoryTerms.set(term.term.toLowerCase(), {
        definition: term.definition,
        category: term.category,
        pronunciation: term.pronunciation
      });
    });
  }

  // Setup voice commands for laboratory operations
  private setupVoiceCommands(): void {
    this.voiceCommands = [
      // Analysis Commands
      {
        command: 'analyze sample',
        aliases: ['analyze this sample', 'run analysis', 'start analysis'],
        action: 'start_analysis',
        description: 'Start sample analysis',
        category: 'analysis'
      },
      {
        command: 'show results',
        aliases: ['display results', 'view results', 'get results'],
        action: 'show_results',
        description: 'Display analysis results',
        category: 'analysis'
      },
      
      // Protocol Commands
      {
        command: 'create protocol',
        aliases: ['new protocol', 'generate protocol', 'design protocol'],
        action: 'create_protocol',
        description: 'Create new experimental protocol',
        category: 'protocol'
      },
      {
        command: 'load protocol',
        aliases: ['open protocol', 'get protocol'],
        action: 'load_protocol',
        description: 'Load existing protocol',
        category: 'protocol',
        parameters: ['protocol_name']
      },
      
      // Equipment Commands
      {
        command: 'check equipment',
        aliases: ['equipment status', 'machine status'],
        action: 'check_equipment',
        description: 'Check equipment status',
        category: 'equipment'
      },
      {
        command: 'calibrate equipment',
        aliases: ['start calibration', 'calibrate machine'],
        action: 'calibrate_equipment',
        description: 'Start equipment calibration',
        category: 'equipment',
        parameters: ['equipment_name']
      },
      
      // Navigation Commands
      {
        command: 'go to dashboard',
        aliases: ['open dashboard', 'show dashboard'],
        action: 'navigate_dashboard',
        description: 'Navigate to dashboard',
        category: 'navigation'
      },
      {
        command: 'open settings',
        aliases: ['go to settings', 'show settings'],
        action: 'navigate_settings',
        description: 'Navigate to settings',
        category: 'navigation'
      },
      
      // General Commands
      {
        command: 'help',
        aliases: ['show help', 'what can you do', 'commands'],
        action: 'show_help',
        description: 'Show available voice commands',
        category: 'general'
      },
      {
        command: 'stop listening',
        aliases: ['stop', 'cancel', 'nevermind'],
        action: 'stop_listening',
        description: 'Stop voice recognition',
        category: 'general'
      }
    ];
  }

  // Identify laboratory terms in speech
  private identifyLaboratoryTerms(transcript: string): Array<{ term: string; definition: string; category: string }> {
    const words = transcript.toLowerCase().split(/\s+/);
    const foundTerms: Array<{ term: string; definition: string; category: string }> = [];

    for (const word of words) {
      const termInfo = this.laboratoryTerms.get(word);
      if (termInfo) {
        foundTerms.push({
          term: word,
          definition: termInfo.definition,
          category: termInfo.category
        });
      }
    }

    return foundTerms;
  }

  // Recognize voice commands
  private recognizeVoiceCommand(transcript: string): VoiceCommand | null {
    const lowerTranscript = transcript.toLowerCase().trim();

    for (const command of this.voiceCommands) {
      // Check exact command match
      if (lowerTranscript === command.command) {
        return command;
      }

      // Check aliases
      for (const alias of command.aliases) {
        if (lowerTranscript === alias || lowerTranscript.includes(alias)) {
          return command;
        }
      }
    }

    return null;
  }

  // Enhance text for better laboratory pronunciation
  private enhanceTextForLaboratory(text: string): string {
    let enhancedText = text;

    this.laboratoryTerms.forEach((termInfo, term) => {
      if (termInfo.pronunciation) {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        enhancedText = enhancedText.replace(regex, termInfo.pronunciation);
      }
    });

    return enhancedText;
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Utility methods
  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  getCurrentConfig(): VoiceProcessingConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<VoiceProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.recognition) {
      this.recognition.continuous = this.config.continuousListening;
      this.recognition.lang = this.config.language;
    }
  }

  getVoiceCommands(): VoiceCommand[] {
    return [...this.voiceCommands];
  }

  getLaboratoryTerms(): Array<{ term: string; definition: string; category: string }> {
    return Array.from(this.laboratoryTerms.entries()).map(([term, info]) => ({
      term,
      definition: info.definition,
      category: info.category
    }));
  }

  // Cleanup
  destroy(): void {
    this.stopListening();
    this.stopSpeaking();
    this.eventListeners.clear();
  }
}

// React hook for voice processing
export function useVoiceProcessing(config?: Partial<VoiceProcessingConfig>) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastTranscript, setLastTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voiceService = useMemo(() => new VoiceProcessingService(config), []);

  useEffect(() => {
    setIsSupported(voiceService.isSupported() && voiceService.isSpeechSynthesisSupported());

    const handleListeningStart = () => setIsListening(true);
    const handleListeningEnd = () => setIsListening(false);
    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);
    const handleAudioLevel = (data: { level: number }) => setAudioLevel(data.level);
    const handleSpeechResult = (result: SpeechRecognitionResult) => {
      setLastTranscript(result.transcript);
      setError(null);
    };
    const handleError = (error: any) => setError(error.message || 'Voice processing error');

    voiceService.on('listening-start', handleListeningStart);
    voiceService.on('listening-end', handleListeningEnd);
    voiceService.on('speech-start', handleSpeechStart);
    voiceService.on('speech-end', handleSpeechEnd);
    voiceService.on('audio-level', handleAudioLevel);
    voiceService.on('speech-result', handleSpeechResult);
    voiceService.on('speech-error', handleError);

    return () => {
      voiceService.destroy();
    };
  }, [voiceService]);

  const startListening = useCallback(async () => {
    try {
      await voiceService.startListening();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }, [voiceService]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
  }, [voiceService]);

  const speak = useCallback(async (text: string, options?: VoiceSynthesisOptions) => {
    try {
      await voiceService.speak(text, options);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }, [voiceService]);

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
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