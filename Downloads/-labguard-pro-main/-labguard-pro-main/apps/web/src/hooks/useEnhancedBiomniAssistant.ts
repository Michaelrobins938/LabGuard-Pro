import { useState, useEffect, useCallback } from 'react';
import { enhancedBiomniAgent, MultiModalInput, AgenticTask, ResearchCapabilities, AgenticConfig } from '@/lib/ai/enhanced-biomni-agent';

interface LabContext {
  currentPage: string;
  userRole: string;
  equipmentCount: number;
  pendingCalibrations: number;
  complianceScore: number;
  recentAlerts: string[];
  activeExperiments: number;
  dataAnalysisQueue: number;
  qualityMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
  };
}

interface EnhancedAssistantState {
  isVisible: boolean;
  isExpanded: boolean;
  isFullscreen: boolean;
  isProcessing: boolean;
  biomniAvailable: boolean;
  labContext: LabContext;
  activeTasks: AgenticTask[];
  capabilities: ResearchCapabilities;
  config: AgenticConfig;
  currentModality: 'text' | 'voice' | 'image' | 'file' | 'data' | 'sensor';
  uploadedFiles: File[];
  capturedMedia: {
    image: string | null;
    video: string | null;
  };
  sensorData: any;
  conversationHistory: any[];
  systemAlerts: any[];
}

interface UseEnhancedBiomniAssistantReturn {
  state: EnhancedAssistantState;
  actions: {
    // Basic Controls
    toggleVisibility: () => void;
    toggleExpanded: () => void;
    toggleFullscreen: () => void;
    
    // Multi-Modal Processing
    processMultiModalInput: (inputs: MultiModalInput[]) => Promise<any>;
    processTextInput: (text: string) => Promise<any>;
    processVoiceInput: (audio: Blob) => Promise<any>;
    processImageInput: (image: Blob) => Promise<any>;
    processFileInput: (file: File) => Promise<any>;
    processDataInput: (data: any) => Promise<any>;
    processSensorInput: (sensorData: any) => Promise<any>;
    
    // Agentic Task Management
    executeAgenticTask: (task: AgenticTask) => Promise<any>;
    createResearchTask: (description: string) => Promise<any>;
    createProtocolTask: (description: string) => Promise<any>;
    createAnalysisTask: (description: string, data: any) => Promise<any>;
    createMonitoringTask: (description: string) => Promise<any>;
    createOptimizationTask: (description: string) => Promise<any>;
    createComplianceTask: (description: string) => Promise<any>;
    
    // Advanced Research Capabilities
    conductAdvancedResearch: (query: string) => Promise<any>;
    conductMultiModalAnalysis: (data: any) => Promise<any>;
    designExperimentalProtocol: (experiment: string) => Promise<any>;
    analyzeGenomicData: (data: any) => Promise<any>;
    reviewLiterature: (topic: string) => Promise<any>;
    generateHypothesis: (data: any) => Promise<any>;
    
    // Laboratory Management
    monitorEquipment: () => Promise<any>;
    predictMaintenance: () => Promise<any>;
    checkCompliance: () => Promise<any>;
    controlQuality: () => Promise<any>;
    optimizeWorkflow: (workflow: any) => Promise<any>;
    
    // Configuration Management
    updateAgentConfig: (config: Partial<AgenticConfig>) => void;
    updateLabContext: (context: Partial<LabContext>) => void;
    setModality: (modality: 'text' | 'voice' | 'image' | 'file' | 'data' | 'sensor') => void;
    
    // File and Media Management
    addUploadedFiles: (files: File[]) => void;
    removeUploadedFile: (index: number) => void;
    setCapturedImage: (image: string | null) => void;
    setCapturedVideo: (video: string | null) => void;
    setSensorData: (data: any) => void;
    
    // System Management
    clearConversation: () => void;
    clearAlerts: () => void;
    getSystemStatus: () => Promise<any>;
    checkBiomniAvailability: () => Promise<boolean>;
  };
}

export function useEnhancedBiomniAssistant(): UseEnhancedBiomniAssistantReturn {
  const [state, setState] = useState<EnhancedAssistantState>({
    isVisible: true,
    isExpanded: false,
    isFullscreen: false,
    isProcessing: false,
    biomniAvailable: false,
    labContext: {
      currentPage: 'dashboard',
      userRole: 'lab_manager',
      equipmentCount: 145,
      pendingCalibrations: 3,
      complianceScore: 98.5,
      recentAlerts: [],
      activeExperiments: 12,
      dataAnalysisQueue: 5,
      qualityMetrics: {
        accuracy: 0.98,
        precision: 0.97,
        recall: 0.96
      }
    },
    activeTasks: [],
    capabilities: enhancedBiomniAgent.getCapabilities(),
    config: enhancedBiomniAgent.getConfig(),
    currentModality: 'text',
    uploadedFiles: [],
    capturedMedia: {
      image: null,
      video: null
    },
    sensorData: null,
    conversationHistory: [],
    systemAlerts: []
  });

  // Initialize assistant
  useEffect(() => {
    const initializeAssistant = async () => {
      const available = await enhancedBiomniAgent.getCapabilities();
      setState(prev => ({
        ...prev,
        biomniAvailable: true, // For demo purposes
        capabilities: available
      }));
      
      // Update lab context
      enhancedBiomniAgent.updateLabContext(state.labContext);
    };

    initializeAssistant();
  }, []);

  // Basic Controls
  const toggleVisibility = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const toggleExpanded = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  }, []);

  // Multi-Modal Processing
  const processMultiModalInput = useCallback(async (inputs: MultiModalInput[]): Promise<any> => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const result = await enhancedBiomniAgent.processMultiModalInput(inputs);
      
      // Add to conversation history
      setState(prev => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, {
          type: 'multi_modal',
          inputs,
          result,
          timestamp: Date.now()
        }]
      }));
      
      return result;
    } catch (error) {
      console.error('Multi-modal processing error:', error);
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, []);

  const processTextInput = useCallback(async (text: string): Promise<any> => {
    return await processMultiModalInput([{
      type: 'text',
      content: text,
      metadata: { timestamp: Date.now() }
    }]);
  }, [processMultiModalInput]);

  const processVoiceInput = useCallback(async (audio: Blob): Promise<any> => {
    return await processMultiModalInput([{
      type: 'voice',
      content: audio,
      metadata: { timestamp: Date.now() }
    }]);
  }, [processMultiModalInput]);

  const processImageInput = useCallback(async (image: Blob): Promise<any> => {
    return await processMultiModalInput([{
      type: 'image',
      content: image,
      metadata: { timestamp: Date.now() }
    }]);
  }, [processMultiModalInput]);

  const processFileInput = useCallback(async (file: File): Promise<any> => {
    return await processMultiModalInput([{
      type: 'file',
      content: file,
      metadata: { 
        format: file.type,
        size: file.size,
        timestamp: Date.now()
      }
    }]);
  }, [processMultiModalInput]);

  const processDataInput = useCallback(async (data: any): Promise<any> => {
    return await processMultiModalInput([{
      type: 'data',
      content: JSON.stringify(data),
      metadata: { timestamp: Date.now() }
    }]);
  }, [processMultiModalInput]);

  const processSensorInput = useCallback(async (sensorData: any): Promise<any> => {
    return await processMultiModalInput([{
      type: 'sensor',
      content: JSON.stringify(sensorData),
      metadata: { timestamp: Date.now() }
    }]);
  }, [processMultiModalInput]);

  // Agentic Task Management
  const executeAgenticTask = useCallback(async (task: AgenticTask): Promise<any> => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true,
      activeTasks: [...prev.activeTasks, task]
    }));
    
    try {
      const result = await enhancedBiomniAgent.executeAgenticTask(task);
      
      // Update task status
      setState(prev => ({
        ...prev,
        activeTasks: prev.activeTasks.map(t => 
          t.id === task.id ? { ...t, status: 'completed' } : t
        )
      }));
      
      return result;
    } catch (error) {
      console.error('Task execution error:', error);
      
      // Update task status to failed
      setState(prev => ({
        ...prev,
        activeTasks: prev.activeTasks.map(t => 
          t.id === task.id ? { ...t, status: 'failed' } : t
        )
      }));
      
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, []);

  const createResearchTask = useCallback(async (description: string): Promise<any> => {
    const task: AgenticTask = {
      id: `research-${Date.now()}`,
      type: 'research',
      priority: 'medium',
      status: 'pending',
      description,
      input: [],
      expectedOutput: 'Research analysis results',
      tools: ['enhanced_biomni_agent'],
      context: { labContext: state.labContext }
    };
    
    return await executeAgenticTask(task);
  }, [executeAgenticTask, state.labContext]);

  const createProtocolTask = useCallback(async (description: string): Promise<any> => {
    const task: AgenticTask = {
      id: `protocol-${Date.now()}`,
      type: 'protocol',
      priority: 'medium',
      status: 'pending',
      description,
      input: [],
      expectedOutput: 'Experimental protocol',
      tools: ['enhanced_biomni_agent'],
      context: { labContext: state.labContext }
    };
    
    return await executeAgenticTask(task);
  }, [executeAgenticTask, state.labContext]);

  const createAnalysisTask = useCallback(async (description: string, data: any): Promise<any> => {
    const task: AgenticTask = {
      id: `analysis-${Date.now()}`,
      type: 'analysis',
      priority: 'medium',
      status: 'pending',
      description,
      input: [{
        type: 'data',
        content: JSON.stringify(data),
        metadata: { timestamp: Date.now() }
      }],
      expectedOutput: 'Data analysis results',
      tools: ['enhanced_biomni_agent'],
      context: { labContext: state.labContext }
    };
    
    return await executeAgenticTask(task);
  }, [executeAgenticTask, state.labContext]);

  const createMonitoringTask = useCallback(async (description: string): Promise<any> => {
    const task: AgenticTask = {
      id: `monitoring-${Date.now()}`,
      type: 'monitoring',
      priority: 'low',
      status: 'pending',
      description,
      input: [],
      expectedOutput: 'Monitoring report',
      tools: ['enhanced_biomni_agent'],
      context: { labContext: state.labContext }
    };
    
    return await executeAgenticTask(task);
  }, [executeAgenticTask, state.labContext]);

  const createOptimizationTask = useCallback(async (description: string): Promise<any> => {
    const task: AgenticTask = {
      id: `optimization-${Date.now()}`,
      type: 'optimization',
      priority: 'medium',
      status: 'pending',
      description,
      input: [],
      expectedOutput: 'Optimization recommendations',
      tools: ['enhanced_biomni_agent'],
      context: { labContext: state.labContext }
    };
    
    return await executeAgenticTask(task);
  }, [executeAgenticTask, state.labContext]);

  const createComplianceTask = useCallback(async (description: string): Promise<any> => {
    const task: AgenticTask = {
      id: `compliance-${Date.now()}`,
      type: 'compliance',
      priority: 'high',
      status: 'pending',
      description,
      input: [],
      expectedOutput: 'Compliance report',
      tools: ['enhanced_biomni_agent'],
      context: { labContext: state.labContext }
    };
    
    return await executeAgenticTask(task);
  }, [executeAgenticTask, state.labContext]);

  // Advanced Research Capabilities
  const conductAdvancedResearch = useCallback(async (query: string): Promise<any> => {
    return await enhancedBiomniAgent.conductAdvancedResearch(query, state.labContext);
  }, [state.labContext]);

  const conductMultiModalAnalysis = useCallback(async (data: any): Promise<any> => {
    return await enhancedBiomniAgent.conductMultiModalAnalysis(data, state.labContext);
  }, [state.labContext]);

  const designExperimentalProtocol = useCallback(async (experiment: string): Promise<any> => {
    return await enhancedBiomniAgent.designExperimentalProtocol(experiment, state.labContext);
  }, [state.labContext]);

  const analyzeGenomicData = useCallback(async (data: any): Promise<any> => {
    return await enhancedBiomniAgent.analyzeGenomicData(data, state.labContext);
  }, [state.labContext]);

  const reviewLiterature = useCallback(async (topic: string): Promise<any> => {
    return await enhancedBiomniAgent.reviewLiterature(topic, state.labContext);
  }, [state.labContext]);

  const generateHypothesis = useCallback(async (data: any): Promise<any> => {
    return await enhancedBiomniAgent.generateHypothesis(data, state.labContext);
  }, [state.labContext]);

  // Laboratory Management
  const monitorEquipment = useCallback(async (): Promise<any> => {
    return await enhancedBiomniAgent.monitorEquipment();
  }, []);

  const predictMaintenance = useCallback(async (): Promise<any> => {
    return await enhancedBiomniAgent.predictMaintenance();
  }, []);

  const checkCompliance = useCallback(async (): Promise<any> => {
    return await enhancedBiomniAgent.checkCompliance();
  }, []);

  const controlQuality = useCallback(async (): Promise<any> => {
    return await enhancedBiomniAgent.controlQuality();
  }, []);

  const optimizeWorkflow = useCallback(async (workflow: any): Promise<any> => {
    return await enhancedBiomniAgent.optimizeLabWorkflow(workflow);
  }, []);

  // Configuration Management
  const updateAgentConfig = useCallback((config: Partial<AgenticConfig>) => {
    enhancedBiomniAgent.updateConfig(config);
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...config }
    }));
  }, []);

  const updateLabContext = useCallback((context: Partial<LabContext>) => {
    const newContext = { ...state.labContext, ...context };
    enhancedBiomniAgent.updateLabContext(newContext);
    setState(prev => ({
      ...prev,
      labContext: newContext
    }));
  }, [state.labContext]);

  const setModality = useCallback((modality: 'text' | 'voice' | 'image' | 'file' | 'data' | 'sensor') => {
    setState(prev => ({ ...prev, currentModality: modality }));
  }, []);

  // File and Media Management
  const addUploadedFiles = useCallback((files: File[]) => {
    setState(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
  }, []);

  const removeUploadedFile = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  }, []);

  const setCapturedImage = useCallback((image: string | null) => {
    setState(prev => ({
      ...prev,
      capturedMedia: { ...prev.capturedMedia, image }
    }));
  }, []);

  const setCapturedVideo = useCallback((video: string | null) => {
    setState(prev => ({
      ...prev,
      capturedMedia: { ...prev.capturedMedia, video }
    }));
  }, []);

  const setSensorData = useCallback((data: any) => {
    setState(prev => ({ ...prev, sensorData: data }));
  }, []);

  // System Management
  const clearConversation = useCallback(() => {
    setState(prev => ({ ...prev, conversationHistory: [] }));
  }, []);

  const clearAlerts = useCallback(() => {
    setState(prev => ({ ...prev, systemAlerts: [] }));
  }, []);

  const getSystemStatus = useCallback(async (): Promise<any> => {
    return {
      capabilities: enhancedBiomniAgent.getCapabilities(),
      config: enhancedBiomniAgent.getConfig(),
      activeTasks: enhancedBiomniAgent.getActiveTasks(),
      labContext: state.labContext
    };
  }, [state.labContext]);

  const checkBiomniAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const available = await enhancedBiomniAgent.checkAvailability();
      setState(prev => ({ ...prev, biomniAvailable: available }));
      return available;
    } catch (error) {
      console.error('Failed to check Biomni availability:', error);
      setState(prev => ({ ...prev, biomniAvailable: false }));
      return false;
    }
  }, []);

  return {
    state,
    actions: {
      // Basic Controls
      toggleVisibility,
      toggleExpanded,
      toggleFullscreen,
      
      // Multi-Modal Processing
      processMultiModalInput,
      processTextInput,
      processVoiceInput,
      processImageInput,
      processFileInput,
      processDataInput,
      processSensorInput,
      
      // Agentic Task Management
      executeAgenticTask,
      createResearchTask,
      createProtocolTask,
      createAnalysisTask,
      createMonitoringTask,
      createOptimizationTask,
      createComplianceTask,
      
      // Advanced Research Capabilities
      conductAdvancedResearch,
      conductMultiModalAnalysis,
      designExperimentalProtocol,
      analyzeGenomicData,
      reviewLiterature,
      generateHypothesis,
      
      // Laboratory Management
      monitorEquipment,
      predictMaintenance,
      checkCompliance,
      controlQuality,
      optimizeWorkflow,
      
      // Configuration Management
      updateAgentConfig,
      updateLabContext,
      setModality,
      
      // File and Media Management
      addUploadedFiles,
      removeUploadedFile,
      setCapturedImage,
      setCapturedVideo,
      setSensorData,
      
      // System Management
      clearConversation,
      clearAlerts,
      getSystemStatus,
      checkBiomniAvailability
    }
  };
} 