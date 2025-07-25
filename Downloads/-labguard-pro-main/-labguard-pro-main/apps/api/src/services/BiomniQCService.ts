import { PrismaClient } from '@labguard/database'
import { logger } from '../utils/logger'
import { BiomniService } from './BiomniService'

const prisma = new PrismaClient()

export interface QCPredictionRequest {
  testType: 'WestNile' | 'COVID' | 'Influenza' | 'PCR' | 'Serology'
  controlValues: number[]
  reagentLot: string
  environmentalData: {
    temperature: number
    humidity: number
    timestamp: Date
  }[]
  historicalQC: QCResult[]
  equipmentId: string
  laboratoryId: string
}

export interface QCPredictionResponse {
  failureRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  predictedFailureTime: Date | null
  recommendedActions: string[]
  confidenceScore: number
  affectedTests: string[]
  estimatedImpact: {
    delayedResults: number
    affectedClients: number
    costImpact: number
  }
}

export interface QCResult {
  id: string
  testType: string
  controlValue: number
  expectedRange: { min: number; max: number }
  timestamp: Date
  status: 'PASS' | 'FAIL' | 'WARNING'
  equipmentId: string
  technicianId: string
}

export interface ClientNotificationProtocol {
  generateDelayNotification(params: {
    testType: string
    originalETA: Date
    newETA: Date
    reason: 'QC_FAILURE' | 'INSTRUMENT_DOWN' | 'REAGENT_ISSUE'
    clientInfo: ClientContact
  }): Promise<{
    emailTemplate: string
    smsMessage: string
    phoneScript: string
  }>
}

export interface ClientContact {
  id: string
  name: string
  email: string
  phone: string
  organization: string
  urgency: 'ROUTINE' | 'URGENT' | 'STAT'
}

export class BiomniQCService {
  private biomniService: BiomniService

  constructor() {
    this.biomniService = new BiomniService()
  }

  /**
   * Predict QC failure using Biomni AI analysis
   */
  async predictQCFailure(request: QCPredictionRequest): Promise<QCPredictionResponse> {
    try {
      logger.info('Starting QC failure prediction', { testType: request.testType, equipmentId: request.equipmentId })

      // Get equipment details
      const equipment = await prisma.equipment.findUnique({
        where: { id: request.equipmentId },
        include: {
          calibrationRecords: {
            take: 10,
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (!equipment) {
        throw new Error('Equipment not found')
      }

      // Prepare Biomni query for QC trend analysis
      const query = `
        Analyze quality control trends for ${request.testType} testing on ${equipment.name} (${equipment.model}).
        
        Equipment Details:
        - Model: ${equipment.model}
        - Manufacturer: ${equipment.manufacturer}
        - Current Status: ${equipment.status}
        - Location: ${equipment.location}
        
        Recent QC Data:
        ${request.historicalQC.map(qc => 
          `- Date: ${qc.timestamp}, Value: ${qc.controlValue}, Status: ${qc.status}`
        ).join('\n')}
        
        Environmental Conditions:
        ${request.environmentalData.map(env => 
          `- ${env.timestamp}: Temp ${env.temperature}°C, Humidity ${env.humidity}%`
        ).join('\n')}
        
        Reagent Lot: ${request.reagentLot}
        
        Please provide:
        1. Failure risk assessment (LOW/MEDIUM/HIGH/CRITICAL)
        2. Predicted failure timeline
        3. Recommended preventive actions
        4. Confidence score (0-100)
        5. Impact assessment on pending tests
      `

      const biomniResponse = await this.biomniService.executeBiomniQuery({
        query,
        context: 'qc_failure_prediction',
        tools: ['qc_trend_analysis', 'failure_prediction', 'impact_assessment'],
        databases: ['qc_standards', 'equipment_performance', 'environmental_data'],
        userId: 'system',
        labId: request.laboratoryId
      })

      // Parse Biomni response and extract prediction data
      const prediction = this.parseQCPrediction(biomniResponse.result)

      // Get affected tests and clients
      const affectedTests = await this.getAffectedTests(request.testType, request.equipmentId)
      const estimatedImpact = await this.calculateImpact(affectedTests)

      logger.info('QC failure prediction completed', { 
        testType: request.testType, 
        risk: prediction.failureRisk,
        confidence: prediction.confidenceScore 
      })

      return {
        ...prediction,
        affectedTests: affectedTests.map(test => test.id),
        estimatedImpact
      }

    } catch (error) {
      logger.error('QC failure prediction failed:', error)
      throw new Error(`QC failure prediction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate automated client communication for QC delays
   */
  async generateClientNotification(params: {
    testType: string
    originalETA: Date
    newETA: Date
    reason: 'QC_FAILURE' | 'INSTRUMENT_DOWN' | 'REAGENT_ISSUE'
    clientInfo: ClientContact
  }): Promise<{
    emailTemplate: string
    smsMessage: string
    phoneScript: string
  }> {
    try {
      const query = `
        Generate professional client communication for laboratory test delay.
        
        Test Type: ${params.testType}
        Original ETA: ${params.originalETA.toISOString()}
        New ETA: ${params.newETA.toISOString()}
        Reason: ${params.reason}
        Client: ${params.clientInfo.name} (${params.clientInfo.organization})
        Urgency: ${params.clientInfo.urgency}
        
        Generate three communication formats:
        1. Professional email template
        2. SMS message (160 characters max)
        3. Phone call script for follow-up
        
        Tone: Professional, apologetic, reassuring
        Include: Reason for delay, new timeline, contact information, next steps
      `

      const biomniResponse = await this.biomniService.executeBiomniQuery({
        query,
        context: 'client_communication',
        tools: ['communication_generation', 'professional_writing'],
        databases: ['communication_templates', 'client_protocols'],
        userId: 'system',
        labId: 'system'
      })

      return this.parseCommunicationResponse(biomniResponse.result)

    } catch (error) {
      logger.error('Client notification generation failed:', error)
      throw new Error(`Client notification generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate automated QA report for QC failures
   */
  async generateQAReport(params: {
    incidentType: 'QC_FAILURE'
    testDetails: any
    qcValues: QCResult[]
    correctiveActions: string[]
    rootCauseAnalysis: string
  }): Promise<{
    reportText: string
    recommendations: string[]
    followUpActions: string[]
    regulatoryNotifications: string[]
  }> {
    try {
      const query = `
        Generate CLIA-compliant QA report for QC failure incident.
        
        Incident Type: ${params.incidentType}
        Test Details: ${JSON.stringify(params.testDetails)}
        QC Values: ${JSON.stringify(params.qcValues)}
        Corrective Actions: ${params.correctiveActions.join(', ')}
        Root Cause Analysis: ${params.rootCauseAnalysis}
        
        Generate:
        1. Executive summary
        2. Detailed incident description
        3. Root cause analysis
        4. Corrective actions taken
        5. Preventive measures
        6. Regulatory compliance assessment
        7. Follow-up actions required
        8. Required notifications
      `

      const biomniResponse = await this.biomniService.executeBiomniQuery({
        query,
        context: 'qa_reporting',
        tools: ['report_generation', 'regulatory_compliance', 'incident_analysis'],
        databases: ['clia_standards', 'qa_protocols', 'regulatory_requirements'],
        userId: 'system',
        labId: 'system'
      })

      return this.parseQAReport(biomniResponse.result)

    } catch (error) {
      logger.error('QA report generation failed:', error)
      throw new Error(`QA report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Optimize rerun scheduling using AI
   */
  async optimizeRerunScheduling(params: {
    originalTestRun: any
    rerunSchedule: Date
    clientUrgency: 'ROUTINE' | 'URGENT' | 'STAT'
  }): Promise<{
    optimalRunTime: Date
    batchOptimization: string[]
    resourceAllocation: any
  }> {
    try {
      const query = `
        Optimize laboratory rerun scheduling for failed test.
        
        Original Test: ${JSON.stringify(params.originalTestRun)}
        Current Schedule: ${params.rerunSchedule.toISOString()}
        Client Urgency: ${params.clientUrgency}
        
        Consider:
        1. Equipment availability
        2. Technician workload
        3. Batch optimization opportunities
        4. Client urgency levels
        5. Resource constraints
        
        Provide:
        1. Optimal run time
        2. Batch optimization suggestions
        3. Resource allocation plan
        4. Priority adjustments
      `

      const biomniResponse = await this.biomniService.executeBiomniQuery({
        query,
        context: 'rerun_optimization',
        tools: ['scheduling_optimization', 'resource_planning', 'batch_analysis'],
        databases: ['equipment_schedules', 'workload_data', 'optimization_algorithms'],
        userId: 'system',
        labId: 'system'
      })

      return this.parseOptimizationResponse(biomniResponse.result)

    } catch (error) {
      logger.error('Rerun optimization failed:', error)
      throw new Error(`Rerun optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Private helper methods for parsing Biomni responses
  private parseQCPrediction(biomniResult: string): Partial<QCPredictionResponse> {
    // Parse Biomni response to extract prediction data
    // This is a simplified parser - in production, you'd want more robust parsing
    const lines = biomniResult.split('\n')
    
    let failureRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
    let confidenceScore = 50
    let recommendedActions: string[] = []
    let predictedFailureTime: Date | null = null

    for (const line of lines) {
      if (line.includes('CRITICAL')) failureRisk = 'CRITICAL'
      else if (line.includes('HIGH')) failureRisk = 'HIGH'
      else if (line.includes('MEDIUM')) failureRisk = 'MEDIUM'
      else if (line.includes('LOW')) failureRisk = 'LOW'
      
      if (line.includes('confidence') || line.includes('Confidence')) {
        const match = line.match(/(\d+)%/)
        if (match) confidenceScore = parseInt(match[1])
      }
      
      if (line.includes('recommend') || line.includes('action')) {
        recommendedActions.push(line.trim())
      }
    }

    return {
      failureRisk,
      confidenceScore,
      recommendedActions,
      predictedFailureTime
    }
  }

  private parseCommunicationResponse(biomniResult: string): {
    emailTemplate: string
    smsMessage: string
    phoneScript: string
  } {
    // Parse Biomni response to extract communication templates
    const sections = biomniResult.split('---')
    
    return {
      emailTemplate: sections[0] || 'Default email template',
      smsMessage: sections[1] || 'Default SMS message',
      phoneScript: sections[2] || 'Default phone script'
    }
  }

  private parseQAReport(biomniResult: string): {
    reportText: string
    recommendations: string[]
    followUpActions: string[]
    regulatoryNotifications: string[]
  } {
    // Parse Biomni response to extract QA report sections
    const sections = biomniResult.split('---')
    
    return {
      reportText: sections[0] || 'Default report text',
      recommendations: sections[1]?.split('\n').filter(line => line.trim()) || [],
      followUpActions: sections[2]?.split('\n').filter(line => line.trim()) || [],
      regulatoryNotifications: sections[3]?.split('\n').filter(line => line.trim()) || []
    }
  }

  private parseOptimizationResponse(biomniResult: string): {
    optimalRunTime: Date
    batchOptimization: string[]
    resourceAllocation: any
  } {
    // Parse Biomni response to extract optimization data
    const lines = biomniResult.split('\n')
    
    let optimalRunTime = new Date()
    let batchOptimization: string[] = []
    let resourceAllocation: any = {}

    for (const line of lines) {
      if (line.includes('optimal') || line.includes('recommended time')) {
        // Extract time information
        const timeMatch = line.match(/(\d{1,2}):(\d{2})/)
        if (timeMatch) {
          optimalRunTime.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]))
        }
      }
      
      if (line.includes('batch') || line.includes('group')) {
        batchOptimization.push(line.trim())
      }
    }

    return {
      optimalRunTime,
      batchOptimization,
      resourceAllocation
    }
  }

  private async getAffectedTests(testType: string, equipmentId: string): Promise<any[]> {
    // Get pending tests that would be affected by QC failure
    const pendingTests = await prisma.calibrationRecord.findMany({
      where: {
        equipmentId,
        status: 'SCHEDULED'
      },
      include: {
        equipment: true
      }
    })

    return pendingTests
  }

  private async calculateImpact(affectedTests: any[]): Promise<{
    delayedResults: number
    affectedClients: number
    costImpact: number
  }> {
    // Calculate impact metrics
    const delayedResults = affectedTests.length
    const affectedClients = new Set(affectedTests.map(test => test.laboratoryId)).size
    const costImpact = delayedResults * 150 // Estimated cost per delayed result

    return {
      delayedResults,
      affectedClients,
      costImpact
    }
  }
}

export const biomniQCService = new BiomniQCService() 