export interface SurveillanceAnalytics {
  id: string;
  laboratoryId: string;
  reportDate: Date;
  totalSamples: number;
  positiveSamples: number;
  negativeSamples: number;
  pendingSamples: number;
  positiveCases: number;
  positivityRate: number;
  sampleTypes: {
    clinical: number;
    environmental: number;
    food: number;
    water: number;
    other: number;
  };
  priorityLevels: {
    routine: number;
    urgent: number;
    emergency: number;
  };
  turnaroundTime: {
    average: number;
    median: number;
    range: {
      min: number;
      max: number;
    };
  };
  qualityMetrics: {
    accuracy: number;
    precision: number;
    sensitivity: number;
    specificity: number;
  };
  aiInsights: {
    trends: string[];
    anomalies: string[];
    recommendations: string[];
  };
  speciesBreakdown: Array<{
    species: string;
    count: number;
    percentage: number;
  }>;
  geographicDistribution: Array<{
    location: string;
    count: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  temporalTrends: Array<{
    date: string;
    count: number;
    positiveCount: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentMonitoring {
  id: string;
  equipmentId: string;
  laboratoryId: string;
  equipmentType: string;
  monitoringType: 'TEMPERATURE' | 'HUMIDITY' | 'PRESSURE' | 'VIBRATION' | 'CUSTOM';
  parameter: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  isActive: boolean;
  integrationType: string;
  lastCheck?: Date;
  threshold: {
    min: number;
    max: number;
    warning: number;
    critical: number;
  };
  location: string;
  timestamp: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveillanceReport {
  id: string;
  laboratoryId: string;
  reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  reportDate: Date;
  title: string;
  summary: string;
  content: Record<string, any>;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED';
  generatedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VectorTest {
  id: string;
  laboratoryId: string;
  sampleId: string;
  vectorType: 'MOSQUITO' | 'TICK' | 'FLEA' | 'FLY' | 'OTHER';
  species?: string;
  testType: 'PCR' | 'ELISA' | 'CULTURE' | 'MICROSCOPY' | 'OTHER';
  result: 'POSITIVE' | 'NEGATIVE' | 'INCONCLUSIVE' | 'PENDING';
  pathogens: string[];
  collectionDate: Date;
  testDate: Date;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VectorAlert {
  id: string;
  laboratoryId: string;
  alertType: 'DISEASE_DETECTION' | 'POPULATION_SPIKE' | 'NEW_VECTOR' | 'RESISTANCE' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  location: string;
  affectedSpecies: string[];
  detectedPathogens: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'RESOLVED' | 'ESCALATED';
  assignedTo?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 