// Comprehensive AI Types for LabGuard Pro
// This file contains all type definitions for AI services, agents, and integrations

export interface BiomniTaskResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface EquipmentMonitoringResult {
  equipmentId: string;
  status: 'operational' | 'maintenance_needed' | 'critical';
  predictions: MaintenancePrediction[];
  recommendations: string[];
  lastChecked: Date;
}

export interface MaintenancePrediction {
  component: string;
  probability: number;
  timeframe: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost?: number;
}

export interface BiomniAgentConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  debug?: boolean;
}

export interface VoiceProcessingResult {
  transcript: string;
  confidence: number;
  intent?: string;
  entities?: Record<string, any>;
}

export interface ImageAnalysisResult {
  objects: DetectedObject[];
  text?: string;
  quality: number;
  recommendations: string[];
}

export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProtocolGenerationResult {
  title: string;
  steps: ProtocolStep[];
  materials: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  safetyNotes: string[];
}

export interface ProtocolStep {
  stepNumber: number;
  instruction: string;
  duration?: string;
  temperature?: number;
  notes?: string;
}

// Multi-Modal Input Types
export interface MultiModalInput {
  type: 'text' | 'voice' | 'image' | 'file' | 'data' | 'sensor';
  content: string | File | Blob | ArrayBuffer;
  metadata?: {
    format?: string;
    size?: number;
    timestamp?: number;
    source?: string;
    coordinates?: { x: number; y: number; z: number };
  };
}

// Agentic Task Definition
export interface AgenticTask {
  id: string;
  type: 'research' | 'protocol' | 'analysis' | 'monitoring' | 'optimization' | 'compliance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  description: string;
  input: MultiModalInput[];
  expectedOutput: string;
  tools: string[];
  deadline?: number;
  dependencies?: string[];
  context?: any;
}

// Enhanced Research Capabilities
export interface ResearchCapabilities {
  // Core Research
  bioinformaticsAnalysis: boolean;
  protocolDesign: boolean;
  literatureReview: boolean;
  hypothesisGeneration: boolean;
  dataAnalysis: boolean;
  
  // Advanced Features
  multiModalAnalysis: boolean;
  predictiveModeling: boolean;
  experimentalDesign: boolean;
  qualityControl: boolean;
  complianceMonitoring: boolean;
  
  // Tool Access
  availableTools: number;
  availableDatabases: number;
  availableSoftware: number;
  customLabTools: string[];
  
  // Performance
  speedupFactor: number;
  accuracyLevel: string;
  contextWindow: number;
  realTimeProcessing: boolean;
}

// Agentic Behavior Configuration
export interface AgenticConfig {
  autonomyLevel: 'assisted' | 'co-pilot' | 'autonomous';
  decisionThreshold: number;
  proactiveMonitoring: boolean;
  learningEnabled: boolean;
  collaborationMode: boolean;
  safetyChecks: boolean;
}

// Compliance and Quality Types
export interface ComplianceResult {
  status: 'compliant' | 'non_compliant' | 'warning';
  violations: ComplianceViolation[];
  recommendations: string[];
  riskScore: number;
  nextAuditDate: string;
}

export interface ComplianceViolation {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  correctiveAction?: string;
  deadline?: string;
}

export interface QualityControlResult {
  metrics: QualityMetrics;
  deviations: QualityDeviation[];
  correctiveActions: string[];
  qualityScore: number;
  trends: QualityTrend[];
}

export interface QualityMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score?: number;
  throughput?: number;
}

export interface QualityDeviation {
  id: string;
  metric: string;
  expectedValue: number;
  actualValue: number;
  tolerance: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface QualityTrend {
  metric: string;
  values: number[];
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
}

// Equipment and Maintenance Types
export interface EquipmentStatus {
  name: string;
  status: 'operational' | 'maintenance' | 'offline' | 'error';
  calibrationDue: boolean;
  performanceIssues: boolean;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export interface MaintenanceSchedule {
  equipmentId: string;
  maintenanceType: 'preventive' | 'corrective' | 'calibration';
  scheduledDate: string;
  estimatedDuration: number;
  assignedTechnician?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Research and Analysis Types
export interface ResearchResult {
  query: string;
  primaryAnalysis: any;
  literatureReview: any;
  hypothesisGeneration: any;
  experimentalDesign: any;
  predictiveModeling: any;
  qualityAssessment: any;
  synthesis: any;
  confidence: number;
}

export interface DataAnalysisResult {
  rawData: any;
  statisticalAnalysis: any;
  mlInsights: any;
  visualizations: VisualizationRecommendation[];
  confidence: number;
  recommendations: string[];
}

export interface VisualizationRecommendation {
  type: 'chart' | 'graph' | 'heatmap' | 'scatter' | 'histogram';
  title: string;
  description: string;
  dataMapping: Record<string, string>;
  priority: 'low' | 'medium' | 'high';
}

// Workflow and Optimization Types
export interface WorkflowOptimizationResult {
  currentWorkflow: any;
  optimizedWorkflow: any;
  improvements: string[];
  estimatedTimeSavings: string;
  implementationSteps: string[];
  riskAssessment: string;
}

export interface WorkflowImprovement {
  type: 'automation' | 'parallelization' | 'optimization' | 'elimination';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  estimatedSavings: number;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
  session?: {
    userId: string;
    userRole: string;
    labId: string;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: number;
  code?: string;
  details?: any;
}

// Lab Context Types
export interface LabContext {
  userId: string;
  userRole: string;
  labId: string;
  timestamp: number;
  equipment?: EquipmentStatus[];
  protocols?: string[];
  complianceStatus?: ComplianceResult;
  qualityMetrics?: QualityMetrics;
  [key: string]: any;
}

// Add missing types
export interface BiomniResearchResult {
  success: boolean;
  data: any;
  insights?: string[];
  recommendations?: string[];
} 