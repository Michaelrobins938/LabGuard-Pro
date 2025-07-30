export interface ComplianceApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface ComplianceSession {
  user: {
    id: string;
    email: string;
    role: string;
    laboratoryId: string;
  };
}

// AI Chat Types
export interface ChatRequest {
  message: string;
  session: {
    user: {
      id: string;
      email: string;
      role: string;
      laboratoryId: string;
    };
  };
}

export interface ChatResponse {
  response: string;
  complianceScore?: number;
  suggestions?: string[];
}

// PCR Verification Types
export interface Reagent {
  name: string;
  lotNumber: string;
  expirationDate: string;
  concentration: string;
}

export interface TemperatureSettings {
  denaturation: string;
  annealing: string;
  extension: string;
}

export interface QualityControl {
  positiveControl: string;
  negativeControl: string;
  internalControl: string;
}

export interface PCRRequest {
  protocolName: string;
  reagents: Reagent[];
  temperatureSettings: TemperatureSettings;
  cycleCount: number;
  qualityControl: QualityControl;
}

export interface PCRResponse {
  isValid: boolean;
  violations: string[];
  recommendations: string[];
  complianceScore: number;
}

// Media Validation Types
export interface StorageConditions {
  temperature: string;
  humidity: string;
}

export interface MediaQualityControl {
  sterilityTest: boolean;
  performanceTest: boolean;
  pH: number;
}

export interface MediaRequest {
  mediaType: string;
  lotNumber: string;
  expirationDate: string;
  storageConditions: StorageConditions;
  qualityControl: MediaQualityControl;
}

export interface MediaResponse {
  isValid: boolean;
  safetyAlerts: string[];
  expirationWarnings: string[];
  recommendations: string[];
}

// Result Validation Types
export interface ReferenceRange {
  low: number;
  high: number;
}

export interface CriticalValues {
  low: number;
  high: number;
}

export interface ResultQualityControl {
  passed: boolean;
  details: string;
}

export interface ResultRequest {
  testType: string;
  result: string;
  referenceRange: ReferenceRange;
  criticalValues: CriticalValues;
  qualityControl: ResultQualityControl;
}

export interface ResultResponse {
  isValid: boolean;
  criticalAlerts: string[];
  qcEvaluation: string;
  recommendations: string[];
}

// Audit Preparation Types
export type AuditType = 'CAP' | 'CLIA' | 'QMS';

export interface AuditRequest {
  auditType: AuditType;
  laboratoryId: string;
  testMenu: string[];
  lastInspectionDate: string;
  currentProcedures: string[];
}

export interface AuditResponse {
  checklist: string[];
  requiredDocuments: string[];
  riskAreas: string[];
  recommendations: string[];
  estimatedScore: number;
}

// CAP Safety Incident Types
export interface IncidentRequest {
  incidentType: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  involvedPersonnel: string[];
  immediateActions: string[];
  timestamp: string;
}

export interface IncidentResponse {
  isCompliant: boolean;
  requiredActions: string[];
  reportingRequirements: string[];
  followUpSteps: string[];
  riskLevel: string;
  estimatedResolutionTime: string;
}

// Common API Error Response
export interface ApiErrorResponse {
  error: string;
  details?: string;
  code?: string;
}

// Test Data Types for E2E Testing
export interface TestData {
  pcrVerification: PCRRequest;
  mediaValidation: MediaRequest;
  criticalValue: ResultRequest;
  qcEvaluation: ResultRequest;
  capInspection: AuditRequest;
}

// Compliance Score Types
export interface ComplianceScore {
  overall: number;
  pcr: number;
  media: number;
  results: number;
  audit: number;
  safety: number;
  lastUpdated: string;
}

// Laboratory Profile Types
export interface LaboratoryProfile {
  id: string;
  name: string;
  accreditation: string[];
  testMenu: string[];
  personnel: LaboratoryPersonnel[];
  equipment: LaboratoryEquipment[];
  procedures: LaboratoryProcedure[];
}

export interface LaboratoryPersonnel {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  competencyDate: string;
}

export interface LaboratoryEquipment {
  id: string;
  name: string;
  model: string;
  lastCalibration: string;
  nextCalibration: string;
  status: 'active' | 'maintenance' | 'retired';
}

export interface LaboratoryProcedure {
  id: string;
  name: string;
  version: string;
  lastReview: string;
  nextReview: string;
  status: 'active' | 'draft' | 'archived';
} 