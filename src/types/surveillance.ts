export interface LabWareConnection {
  server: string;
  database: string;
  username: string;
  password: string;
  port?: number;
}

export interface LabWareSample {
  id: string;
  sampleId: string;
  patientId: string;
  testType: string;
  result: string;
  collectionDate: string;
  location: string;
  status: string;
}

export interface NEDSSAutomationData {
  countyCode: string;
  startDate: Date;
  endDate: Date;
  caseData: Array<{
    patientId: string;
    sampleId: string;
    testType: string;
    result: string;
    collectionDate: string;
    location: string;
  }>;
}

export interface ArboNETUploadData {
  countyCode: string;
  weekEnding: Date;
  speciesData: Array<{
    species: string;
    count: number;
    location: string;
    latitude?: number;
    longitude?: number;
    trapType: string;
    collectionDate: string;
  }>;
}

export interface SurveillanceReport {
  countyCode: string;
  weekEnding: Date;
  reportType: 'weekly' | 'monthly' | 'quarterly';
  includeMaps: boolean;
  includeHistorical: boolean;
}

export interface SurveillanceReportHistory {
  id: string;
  countyCode: string;
  weekEnding: Date;
  reportType: string;
  filePath?: string;
  generatedAt: Date;
  generatedBy: string;
  summary?: any;
}

export interface SurveillanceAnalytics {
  totalSamples: number;
  positiveCases: number;
  positivityRate: number;
  speciesBreakdown: Array<{
    species: string;
    count: number;
    percentage: number;
  }>;
  geographicDistribution: Array<{
    location: string;
    count: number;
    coordinates?: [number, number];
  }>;
  temporalTrends: Array<{
    date: string;
    count: number;
    positiveCount: number;
  }>;
}

export interface EquipmentMonitoring {
  equipmentType: string;
  integrationType: string;
  credentials?: any;
  isActive: boolean;
  lastCheck?: Date;
  status?: string;
}

export interface SurveillanceMetrics {
  totalSamples: number;
  positiveCases: number;
  positivityRate: number;
  counties: number;
  reportsGenerated: number;
  lastUpdated: Date;
}

export interface SurveillanceConnectionStatus {
  labware: 'connected' | 'disconnected' | 'error';
  nedss: 'connected' | 'disconnected' | 'error';
  arboret: 'connected' | 'disconnected' | 'error';
  equipment: 'connected' | 'disconnected' | 'error';
} 