"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  Bot, 
  FileText, 
  Search, 
  Upload, 
  Download,
  Eye,
  Edit,
  Copy,
  RefreshCw,
  Zap,
  Brain,
  MessageSquare,
  Lightbulb,
  Target,
  BarChart3,
  Microscope,
  Settings,
  Plus,
  Trash2,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share,
  BookOpen,
  Camera,
  Image,
  Video,
  FileImage,
  FileVideo,
  FileText as FileTextIcon,
  Code,
  Database,
  Globe,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: string[];
  metadata?: {
    confidence?: number;
    sources?: string[];
    actions?: string[];
    equipment?: string[];
  };
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  equipment: string[];
  reagents: string[];
  steps: Array<{
    step: number;
    title: string;
    description: string;
    duration: string;
    notes: string[];
  }>;
  safetyNotes: string[];
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VisualAnalysis {
  id: string;
  title: string;
  imageUrl: string;
  analysis: {
    objects: Array<{
      name: string;
      confidence: number;
      boundingBox: [number, number, number, number];
    }>;
    text: string[];
    measurements: Array<{
      type: string;
      value: number;
      unit: string;
    }>;
    anomalies: string[];
  };
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export default function AIPage() {
  const router = useRouter();
  const { aiInsights } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'protocols' | 'research' | 'visual'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysis | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sample data
  const sampleProtocols: Protocol[] = [
    {
      id: '1',
      title: 'PCR Amplification Protocol',
      description: 'Standard polymerase chain reaction protocol for DNA amplification',
      category: 'Molecular Biology',
      difficulty: 'intermediate',
      duration: '2-3 hours',
      equipment: ['Thermal Cycler', 'Microcentrifuge', 'Pipettes', 'PCR Tubes'],
      reagents: ['DNA Template', 'Primers', 'dNTPs', 'Taq Polymerase', 'Buffer'],
      steps: [
        {
          step: 1,
          title: 'Prepare Master Mix',
          description: 'Mix all reagents except template DNA',
          duration: '15 minutes',
          notes: ['Keep on ice', 'Calculate volumes carefully']
        },
        {
          step: 2,
          title: 'Add Template DNA',
          description: 'Add template DNA to master mix',
          duration: '5 minutes',
          notes: ['Use sterile technique', 'Record template concentration']
        },
        {
          step: 3,
          title: 'Run PCR Cycles',
          description: 'Perform 30-35 cycles of denaturation, annealing, and extension',
          duration: '2 hours',
          notes: ['Monitor temperature', 'Check for evaporation']
        }
      ],
      safetyNotes: ['Wear gloves', 'Use UV protection', 'Dispose of waste properly'],
      aiGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const sampleVisualAnalysis: VisualAnalysis = {
    id: '1',
    title: 'Microscope Image Analysis',
    imageUrl: '/api/placeholder/400/300',
    analysis: {
      objects: [
        { name: 'Cell', confidence: 0.95, boundingBox: [100, 100, 200, 200] },
        { name: 'Nucleus', confidence: 0.87, boundingBox: [120, 120, 180, 180] }
      ],
      text: ['Sample ID: LAB-001', 'Date: 2024-01-15'],
      measurements: [
        { type: 'Cell Diameter', value: 15.2, unit: 'μm' },
        { type: 'Nucleus Diameter', value: 8.5, unit: 'μm' }
      ],
      anomalies: ['Possible cell division', 'Irregular nuclear shape']
    },
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you're asking about "${inputMessage}". Let me help you with that. Based on your laboratory context, here are some relevant insights and recommendations.`,
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: 0.92,
          sources: ['LabGuard Database', 'Scientific Literature'],
          actions: ['Schedule calibration', 'Update protocol'],
          equipment: ['Microscope', 'Centrifuge']
        }
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleProtocolGeneration = () => {
    // Simulate protocol generation
    const newProtocol: Protocol = {
      id: Date.now().toString(),
      title: 'AI-Generated Protocol',
      description: 'Protocol generated based on your requirements',
      category: 'Custom',
      difficulty: 'intermediate',
      duration: '1-2 hours',
      equipment: ['Standard Lab Equipment'],
      reagents: ['Common Reagents'],
      steps: [
        {
          step: 1,
          title: 'Preparation',
          description: 'Prepare all necessary materials',
          duration: '30 minutes',
          notes: ['Follow safety guidelines']
        }
      ],
      safetyNotes: ['Standard safety procedures apply'],
      aiGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSelectedProtocol(newProtocol);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      // Simulate analysis
      setTimeout(() => {
        setAnalysisResult(sampleVisualAnalysis);
      }, 3000);
    }
  };

  const handleVisualAnalysis = () => {
    if (uploadedImage) {
      // Simulate analysis
      setAnalysisResult(sampleVisualAnalysis);
    }
  };

  const ChatInterface = () => (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.metadata && (
                <div className="mt-2 text-xs opacity-75">
                  {message.metadata.confidence && (
                    <p>Confidence: {message.metadata.confidence * 100}%</p>
                  )}
                  {message.metadata.sources && (
                    <p>Sources: {message.metadata.sources.join(', ')}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your laboratory..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const ProtocolGenerator = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Protocol Generator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Protocol Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select protocol type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="molecular">Molecular Biology</SelectItem>
                  <SelectItem value="cell">Cell Culture</SelectItem>
                  <SelectItem value="biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="microbiology">Microbiology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe what you want to accomplish..."
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Equipment Available</label>
              <Input placeholder="List available equipment..." />
            </div>
            
            <Button onClick={handleProtocolGeneration} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Generate Protocol
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Protocols</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleProtocols.map((protocol) => (
                <div
                  key={protocol.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => setSelectedProtocol(protocol)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{protocol.title}</h4>
                      <p className="text-sm text-gray-500">{protocol.category}</p>
                    </div>
                    <Badge variant="outline">{protocol.difficulty}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedProtocol && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedProtocol.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{selectedProtocol.category}</Badge>
              <Badge variant="outline">{selectedProtocol.difficulty}</Badge>
              <Badge variant="outline">{selectedProtocol.duration}</Badge>
              {selectedProtocol.aiGenerated && (
                <Badge className="bg-purple-100 text-purple-800">
                  <Bot className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{selectedProtocol.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Equipment Required</h4>
                <div className="space-y-1">
                  {selectedProtocol.equipment.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Microscope className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Reagents</h4>
                <div className="space-y-1">
                  {selectedProtocol.reagents.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Procedure</h4>
              <div className="space-y-3">
                {selectedProtocol.steps.map((step) => (
                  <div key={step.step} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Step {step.step}: {step.title}</h5>
                      <Badge variant="outline">{step.duration}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                    {step.notes.length > 0 && (
                      <div className="mt-2">
                        {step.notes.map((note, index) => (
                          <div key={index} className="flex items-center space-x-1 text-xs text-gray-500">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Safety Notes</h4>
              <div className="space-y-1">
                {selectedProtocol.safetyNotes.map((note, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Protocol
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const VisualAnalysis = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Image Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">
                Upload an image for AI analysis
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="outline" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
            
            {uploadedImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Image: {uploadedImage.name}</p>
                <Button onClick={handleVisualAnalysis} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Detected Objects</h4>
                    <div className="space-y-1">
                      {analysisResult.analysis.objects.map((obj, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{obj.name}</span>
                          <Badge variant="outline">{Math.round(obj.confidence * 100)}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Measurements</h4>
                    <div className="space-y-1">
                      {analysisResult.analysis.measurements.map((measurement, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{measurement.type}</span>
                          <span>{measurement.value} {measurement.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {analysisResult.analysis.anomalies.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Anomalies Detected</h4>
                      <div className="space-y-1">
                        {analysisResult.analysis.anomalies.map((anomaly, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-yellow-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{anomaly}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <p>Upload an image to see analysis results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get AI-powered insights, generate protocols, and analyze data
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Documentation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{chatMessages.length}</p>
                <p className="text-xs text-gray-500">Chat Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{sampleProtocols.length}</p>
                <p className="text-xs text-gray-500">Protocols Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-gray-500">AI Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">&lt;2s</p>
                <p className="text-xs text-gray-500">Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {[
              { id: 'chat', label: 'Chat Assistant', icon: MessageSquare },
              { id: 'protocols', label: 'Protocol Generator', icon: FileText },
              { id: 'research', label: 'Research Assistant', icon: Search },
              { id: 'visual', label: 'Visual Analysis', icon: Camera }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="p-6">
            {activeTab === 'chat' && <ChatInterface />}
            {activeTab === 'protocols' && <ProtocolGenerator />}
            {activeTab === 'research' && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <p>Research Assistant coming soon...</p>
              </div>
            )}
            {activeTab === 'visual' && <VisualAnalysis />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 