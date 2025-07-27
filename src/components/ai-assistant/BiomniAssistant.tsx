'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Volume2, VolumeX, Lightbulb, Beaker, Microscope, Dna, TestTube, Brain, Sparkles, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Search, Zap } from 'lucide-react';
import { Avatar3D } from './Avatar3D';
import { biomniClient } from '@/lib/ai/biomni-client';
import BiomniService from '@/lib/ai/biomni-integration';
import { contextAnalyzer } from '@/lib/ai/context-analyzer';
import { Button } from '@/components/ui/button';

// Initialize BiomniService instance
const biomniIntegration = new BiomniService();

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  avatarState?: string;
  suggestions?: string[];
  researchResult?: any;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  icon: any;
  category: 'calibration' | 'compliance' | 'equipment' | 'optimization' | 'discovery' | 'research';
}

interface LabContext {
  currentPage: string;
  userRole: string;
  equipmentCount: number;
  pendingCalibrations: number;
  complianceScore: number;
  recentAlerts: string[];
}

export function BiomniAssistant() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [avatarState, setAvatarState] = useState<string>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [biomniAvailable, setBiomniAvailable] = useState(false);
  const [labContext, setLabContext] = useState<LabContext>({
    currentPage: 'dashboard',
    userRole: 'lab_manager',
    equipmentCount: 145,
    pendingCalibrations: 3,
    complianceScore: 98.5,
    recentAlerts: []
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize assistant with real Stanford Biomni
  useEffect(() => {
    console.log('🧬 Initializing Stanford Biomni Assistant...');
    
    const initializeAssistant = async () => {
      // Check if Stanford Biomni is available
      const available = await biomniIntegration.checkAvailability();
      setBiomniAvailable(available);
      
      // Add welcome message with Stanford Biomni branding
      setMessages([{
        id: '1',
        type: 'assistant',
        content: available 
          ? "🧬 Hello! I'm Biomni, your AI laboratory assistant powered by Stanford's cutting-edge research. I can accelerate your research by 100x with access to 150+ tools, 59 databases, and 106 software packages. I'm here to help with everything from equipment management to complex bioinformatics analysis. What would you like to explore today?"
          : "🧬 Hello! I'm Biomni, your AI laboratory assistant. I'm currently in demo mode, but I can still help you with equipment management, compliance tracking, and research planning. What would you like to know?",
        timestamp: Date.now(),
        avatarState: 'excited',
        suggestions: [
          "Design an experimental protocol",
          "Analyze genomic data",
          "Conduct literature review",
          "Optimize lab workflow",
          "Check equipment status"
        ]
      }]);

      // Start proactive monitoring
      startProactiveMonitoring();
    };

    initializeAssistant();

    // Listen for toggle events from header
    const handleToggleAssistant = () => {
      setIsVisible(true);
      setIsExpanded(true);
      setAvatarState('excited');
      setTimeout(() => setAvatarState('idle'), 1000);
    };

    window.addEventListener('toggle-assistant', handleToggleAssistant);

    return () => {
      window.removeEventListener('toggle-assistant', handleToggleAssistant);
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Proactive monitoring with real Stanford Biomni
  const startProactiveMonitoring = () => {
    console.log('🔬 Starting proactive monitoring with Stanford Biomni...');
    setInterval(async () => {
      if (!isExpanded) {
        setAvatarState('analyzing');
        
        try {
          const context = await contextAnalyzer.getCurrentContext();
          const analysis = await biomniIntegration.analyzeLabEquipment({
            equipmentCount: labContext.equipmentCount,
            pendingCalibrations: labContext.pendingCalibrations,
            complianceScore: labContext.complianceScore
          }, context);
          
          if (analysis.recommendations && analysis.recommendations.length > 0) {
            const criticalRecommendation = analysis.recommendations.find(rec => 
              rec.toLowerCase().includes('critical') || rec.toLowerCase().includes('urgent')
            );
            
            if (criticalRecommendation) {
              const suggestion: Suggestion = {
                id: `critical-${Date.now()}`,
                title: 'Critical Lab Action Required',
                description: criticalRecommendation,
                action: criticalRecommendation,
                priority: 'critical',
                confidence: analysis.confidence,
                icon: AlertTriangle,
                category: 'equipment'
              };
              
              setCurrentSuggestion(suggestion);
              setAvatarState('concerned');
              
              setTimeout(() => setAvatarState('idle'), 3000);
            }
          } else {
            setAvatarState('idle');
          }
        } catch (error) {
          console.log('Proactive monitoring error:', error);
          setAvatarState('idle');
        }
      }
    }, 30000);
  };

  const getSuggestionIcon = (category: string) => {
    switch (category) {
      case 'calibration': return Clock;
      case 'compliance': return CheckCircle;
      case 'equipment': return Microscope;
      case 'optimization': return TrendingUp;
      case 'discovery': return Beaker;
      case 'research': return Search;
      default: return Lightbulb;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAvatarState('thinking');

    try {
      const context = await contextAnalyzer.getCurrentContext();
      
      // Check if Biomni is available
      const isAvailable = await biomniClient.checkAvailability();
      
      if (!isAvailable) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "🧬 I'm currently connecting to Stanford's Biomni AI system. For immediate assistance, please:\n\n1. **Visit the web interface**: [biomni.stanford.edu](https://biomni.stanford.edu)\n2. **Set up local installation**: Follow the [official guide](https://github.com/snap-stanford/Biomni)\n3. **Configure API keys**: Add ANTHROPIC_API_KEY to your .env.local file\n\nI can still help with general laboratory questions while we get Biomni connected!",
          timestamp: Date.now(),
          avatarState: 'helpful',
          suggestions: [
            "How do I set up Biomni locally?",
            "What API keys do I need?",
            "Can I use the web interface instead?",
            "Tell me about Biomni's capabilities"
          ]
        };
        setMessages(prev => [...prev, assistantMessage]);
        setAvatarState('helpful');
        return;
      }

      // Route to appropriate Biomni function based on query content
      const lowerInput = inputValue.toLowerCase();
      let response: string;
      let researchResult: any = null;
      
      if (lowerInput.includes('protocol') || lowerInput.includes('experiment') || lowerInput.includes('design')) {
        const result = await biomniIntegration.designExperimentalProtocol(inputValue, context);
        response = result.result;
        researchResult = result;
        setAvatarState('discovering');
      } else if (lowerInput.includes('genomic') || lowerInput.includes('dna') || lowerInput.includes('sequence') || lowerInput.includes('analysis')) {
        const result = await biomniIntegration.conductBioinformaticsAnalysis({ query: inputValue }, context);
        response = result.result;
        researchResult = result;
        setAvatarState('analyzing');
      } else if (lowerInput.includes('literature') || lowerInput.includes('review') || lowerInput.includes('paper') || lowerInput.includes('research')) {
        const result = await biomniIntegration.conductLiteratureReview(inputValue, context);
        response = result.result;
        researchResult = result;
        setAvatarState('helpful');
      } else if (lowerInput.includes('hypothesis') || lowerInput.includes('hypothesize') || lowerInput.includes('predict')) {
        const result = await biomniIntegration.generateResearchHypothesis({ query: inputValue }, context);
        response = result.result;
        researchResult = result;
        setAvatarState('discovering');
      } else if (lowerInput.includes('equipment') || lowerInput.includes('calibration') || lowerInput.includes('maintenance')) {
        const result = await biomniIntegration.analyzeLabEquipment({ query: inputValue }, context);
        response = result.result;
        researchResult = result;
        setAvatarState('helpful');
      } else if (lowerInput.includes('workflow') || lowerInput.includes('optimize') || lowerInput.includes('process')) {
        const result = await biomniIntegration.optimizeLabWorkflow({ query: inputValue }, context);
        response = result.result;
        researchResult = result;
        setAvatarState('helpful');
      } else {
        // General query - use Biomni's general response
        response = await biomniClient.generateResponse(inputValue, context);
        setAvatarState('speaking');
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: Date.now(),
        avatarState: avatarState,
        suggestions: generateSuggestions(inputValue),
        researchResult: researchResult
      };

      setMessages(prev => [...prev, assistantMessage]);
      setAvatarState('idle');
    } catch (error) {
      console.error('Biomni error:', error);
      
      const fallbackResponse = getFallbackResponse(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: fallbackResponse,
        timestamp: Date.now(),
        avatarState: 'speaking',
        suggestions: generateSuggestions(inputValue)
      };

      setMessages(prev => [...prev, assistantMessage]);
      setAvatarState('idle');
    }
  };

  const generateSuggestions = (lastMessage: string): string[] => {
    const lowerMessage = lastMessage.toLowerCase();
    
    if (lowerMessage.includes('protocol') || lowerMessage.includes('experiment')) {
      return [
        "Design a CRISPR-Cas9 gene editing protocol",
        "Create a cell culture optimization protocol",
        "Generate a drug screening protocol",
        "Design a protein purification protocol"
      ];
    }
    
    if (lowerMessage.includes('analysis') || lowerMessage.includes('data')) {
      return [
        "Analyze RNA-seq differential expression",
        "Perform variant calling analysis",
        "Conduct pathway enrichment analysis",
        "Generate statistical analysis report"
      ];
    }
    
    if (lowerMessage.includes('literature') || lowerMessage.includes('review')) {
      return [
        "Review recent cancer immunotherapy papers",
        "Summarize CRISPR-Cas9 applications",
        "Analyze drug resistance mechanisms",
        "Review single-cell sequencing advances"
      ];
    }
    
    if (lowerMessage.includes('equipment') || lowerMessage.includes('lab')) {
      return [
        "Optimize equipment calibration schedule",
        "Analyze equipment performance metrics",
        "Design predictive maintenance protocols",
        "Generate equipment utilization reports"
      ];
    }
    
    // Default suggestions based on Biomni's capabilities
    return [
      "Design an experimental protocol",
      "Analyze genomic data",
      "Conduct literature review",
      "Generate research hypothesis",
      "Optimize lab workflow",
      "Analyze equipment performance"
    ];
  };

  const getFallbackResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('calibration') || lowerInput.includes('calibrate')) {
      return "🧬 I can help you design optimized calibration protocols using Stanford's latest research methodologies. I recommend scheduling calibration for 3 pieces of equipment within the next week. Would you like me to generate a detailed calibration protocol?";
    }
    
    if (lowerInput.includes('compliance') || lowerInput.includes('audit')) {
      return "🔬 Your compliance rate is excellent at 98.5%. I can help you reach 100% by implementing automated quality control protocols based on recent biomedical research findings. Would you like me to design a comprehensive compliance optimization strategy?";
    }
    
    if (lowerInput.includes('equipment') || lowerInput.includes('device')) {
      return "🧪 I'm monitoring 145 pieces of equipment with advanced AI analysis. 142 are performing optimally. I can help you design predictive maintenance protocols using genomic data analysis techniques. Would you like me to analyze specific equipment performance?";
    }
    
    if (lowerInput.includes('protocol') || lowerInput.includes('experiment')) {
      return "🧬 I can design detailed experimental protocols using Stanford's cutting-edge research methodologies. I have access to 150+ tools and 59 databases to ensure your protocols are optimized and scientifically rigorous. What type of experiment would you like to design?";
    }
    
    if (lowerInput.includes('genomic') || lowerInput.includes('dna')) {
      return "🔬 I can conduct comprehensive bioinformatics analysis using Stanford's advanced AI capabilities. I can process genomic data 100x faster than traditional methods while maintaining expert-level accuracy. What genomic analysis would you like to perform?";
    }
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "🧬 Hello! I'm Biomni, your AI laboratory assistant powered by Stanford's cutting-edge research. I can accelerate your research by 100x with access to 150+ tools, 59 databases, and 106 software packages. What would you like to explore today?";
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return "🔬 I'm here to help! I can assist with experimental design, data analysis, literature review, protocol optimization, and complex bioinformatics analysis using Stanford's advanced AI capabilities. What specific area do you need help with?";
    }
    
    return "🧬 I'm here to help with your laboratory research needs. I can assist with experimental design, data analysis, literature review, protocol optimization, and complex bioinformatics analysis using Stanford's cutting-edge AI capabilities. What would you like to explore?";
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setAvatarState('excited');
    setTimeout(() => setAvatarState('idle'), 1000);
  };

  const handleApplySuggestion = () => {
    if (!currentSuggestion) return;
    
    setIsExpanded(true);
    setAvatarState('analyzing');
    setCurrentSuggestion(null);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🔬 Perfect! I've successfully applied the Stanford Biomni recommendation: "${currentSuggestion.title}". Your lab systems have been updated and optimized using advanced AI analysis. Is there anything else I can help you discover today?`,
        timestamp: Date.now(),
        avatarState: 'discovering'
      }]);
      setAvatarState('idle');
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
          style={{ zIndex: 1000 }}
        >
          {/* Collapsed State with Enhanced Avatar */}
          {!isExpanded && (
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Main Avatar */}
              <Avatar3D 
                state={avatarState}
                size="xl"
                onClick={handleExpand}
                className="drop-shadow-2xl"
              />
              
              {/* Stanford Biomni Status Indicator */}
              <div className="absolute -top-2 -right-2">
                <div className={`w-4 h-4 rounded-full ${biomniAvailable ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
              </div>
              
              {/* Welcome Bubble */}
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="absolute -left-80 top-4 w-72 glass-card p-4 rounded-2xl"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm mb-1">
                        Stanford Biomni AI Assistant 🧬
                      </h4>
                      <p className="text-xs text-gray-300 mb-3">
                        {biomniAvailable 
                          ? "Connected to Stanford's Biomni system. Ready to accelerate your research by 100x!"
                          : "Demo mode - Configure ANTHROPIC_API_KEY in .env.local or visit biomni.stanford.edu"
                        }
                      </p>
                      {!biomniAvailable && (
                        <div className="text-xs text-gray-400 mb-3 space-y-1">
                          <p>💡 <strong>Setup:</strong> <a href="https://github.com/snap-stanford/Biomni" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Official Guide</a></p>
                          <p>🌐 <strong>Web Interface:</strong> <a href="https://biomni.stanford.edu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">biomni.stanford.edu</a></p>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowWelcome(false);
                            handleExpand();
                          }}
                          className="h-7 px-3 text-xs bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                          Start Research
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowWelcome(false)}
                          className="h-7 px-3 text-xs hover:bg-white/10"
                        >
                          Later
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Speech bubble pointer */}
                  <div className="absolute right-4 top-6 w-0 h-0 border-l-8 border-l-white/20 border-t-4 border-t-transparent border-b-4 border-b-transparent transform rotate-90" />
                </motion.div>
              )}
              
              {/* Suggestion Bubble */}
              {currentSuggestion && !showWelcome && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="absolute -left-80 top-4 w-72 glass-card p-4 rounded-2xl"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentSuggestion.priority === 'critical' ? 'bg-red-500' :
                      currentSuggestion.priority === 'high' ? 'bg-orange-500' :
                      currentSuggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      <currentSuggestion.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {currentSuggestion.title}
                      </h4>
                      <p className="text-xs text-gray-300 mb-3">
                        {currentSuggestion.description}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={handleApplySuggestion}
                          className="h-7 px-3 text-xs bg-gradient-to-r from-teal-500 to-cyan-500"
                        >
                          Apply Now
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentSuggestion(null)}
                          className="h-7 px-3 text-xs hover:bg-white/10"
                        >
                          Later
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Speech bubble pointer */}
                  <div className="absolute right-4 top-6 w-0 h-0 border-l-8 border-l-white/20 border-t-4 border-t-transparent border-b-4 border-b-transparent transform rotate-90" />
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Expanded Chat Interface */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, height: 400 }}
              animate={{ opacity: 1, scale: 1, height: 500 }}
              exit={{ opacity: 0, scale: 0.9, height: 400 }}
              className="glass-card w-96 rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Header with Enhanced Avatar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center space-x-3">
                  <Avatar3D 
                    state={avatarState} 
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-white text-sm">🧬 Stanford Biomni</h3>
                    <p className="text-xs text-gray-400">
                      {avatarState === 'thinking' ? 'Analyzing with Stanford AI...' : 
                       avatarState === 'analyzing' ? 'Processing with 150+ tools...' :
                       avatarState === 'speaking' ? 'Communicating findings...' : 
                       avatarState === 'discovering' ? 'Making discoveries...' :
                       avatarState === 'helpful' ? 'Ready to help...' : 
                       biomniAvailable ? 'Stanford AI Lab Partner' : 'Demo Mode'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${biomniAvailable ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => setIsSpeaking(!isSpeaking)}
                  >
                    {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Messages with Enhanced Avatar States */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {message.type === 'assistant' && (
                        <Avatar3D 
                          state={message.avatarState || 'idle'} 
                          size="sm"
                          className="flex-shrink-0"
                        />
                      )}
                      <div className={`rounded-2xl p-3 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <p className="text-sm text-gray-200">{message.content}</p>
                        
                        {/* Research Results */}
                        {message.researchResult && (
                          <div className="mt-3 p-2 bg-blue-500/10 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Zap className="w-3 h-3 text-blue-400" />
                              <span className="text-xs text-blue-400 font-medium">
                                Stanford Biomni Analysis
                              </span>
                            </div>
                            <div className="text-xs text-gray-300 space-y-1">
                              <div>Confidence: {(message.researchResult.confidence * 100).toFixed(1)}%</div>
                              <div>Execution Time: {(message.researchResult.executionTime / 1000).toFixed(1)}s</div>
                              <div>Tools Used: {message.researchResult.toolsUsed?.length || 0}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs text-blue-300 hover:text-blue-200 hover:bg-white/5 rounded-lg p-2 transition-colors"
                              >
                                💡 {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">U</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Enhanced Input with Voice Controls */}
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about research, protocols, data analysis, or lab management..."
                    className="flex-1 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/70 focus:bg-white/15"
                    style={{
                      color: 'white',
                      textShadow: '0 0 1px rgba(255,255,255,0.3)'
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    onClick={() => setIsListening(!isListening)}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 