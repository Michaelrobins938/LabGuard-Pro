import { spawn } from 'child_process'
import { PrismaClient } from '@prisma/client'
import { AuditLogService } from './AuditLogService'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// Enterprise Biomni Configuration
interface BiomniConfig {
  pythonPath: string
  biomniPath: string
  dataPath: string
  llmModel: string
  maxConcurrentQueries: number
  timeoutMs: number
  retryAttempts: number
  cacheDurationMs: number
}

// Request Interface
interface BiomniRequest {
  query: string
  context?: string
  tools?: string[]
  databases?: string[]
  analysisType: 'proteomics' | 'genomics' | 'metabolomics' | 'imaging' | 'general'
  priority: 'low' | 'medium' | 'high' | 'critical'
  userId: string
  labId: string
  sessionId?: string
  metadata?: Record<string, any>
}

// Response Interface
interface BiomniResponse {
  id: string
  result: string
  summary: string
  insights: string[]
  recommendations: string[]
  toolsUsed: string[]
  databasesQueried: string[]
  confidence: number
  executionTime: number
  cost: number
  warnings: string[]
  nextSteps: string[]
  dataQuality: {
    completeness: number
    accuracy: number
    consistency: number
    reliability: number
    issues: string[]
    recommendations: string[]
  }
}

export class BiomniService {
  private config: BiomniConfig
  private prisma: PrismaClient
  private auditLogService: AuditLogService
  private queryQueue: Map<string, BiomniRequest>
  private cache: Map<string, { response: BiomniResponse; timestamp: number }>
  private activeQueries: Set<string>

  constructor() {
    this.config = {
      pythonPath: process.env.BIOMNI_PYTHON_PATH || 'python3',
      biomniPath: process.env.BIOMNI_PATH || './Biomni/biomni',
      dataPath: process.env.BIOMNI_DATA_PATH || './data',
      llmModel: process.env.BIOMNI_LLM || 'gpt-4o',
      maxConcurrentQueries: parseInt(process.env.BIOMNI_MAX_CONCURRENT || '3'),
      timeoutMs: parseInt(process.env.BIOMNI_TIMEOUT_MS || '300000'), // 5 minutes
      retryAttempts: parseInt(process.env.BIOMNI_RETRY_ATTEMPTS || '2'),
      cacheDurationMs: parseInt(process.env.BIOMNI_CACHE_DURATION_MS || '3600000') // 1 hour
    }
    
    this.prisma = new PrismaClient()
    this.auditLogService = new AuditLogService(this.prisma)
    this.queryQueue = new Map()
    this.cache = new Map()
    this.activeQueries = new Set()
  }

  /**
   * Execute Biomni query with comprehensive logging and error handling
   */
  async executeBiomniQuery(request: BiomniRequest): Promise<BiomniResponse> {
    const queryId = this.generateQueryId(request)
    const startTime = Date.now()

    try {
      // Log query initiation
      await this.auditLogService.log({
        laboratoryId: request.labId,
        userId: request.userId,
        action: 'BIOMNI_QUERY_STARTED',
        entity: 'BiomniQuery',
        entityId: queryId,
        details: {
          analysisType: request.analysisType,
          priority: request.priority,
          toolsRequested: request.tools?.length || 0,
          databasesRequested: request.databases?.length || 0
        }
      })

      // Check cache first
      const cachedResult = this.getCachedResult(queryId)
      if (cachedResult) {
        await this.auditLogService.log({
          laboratoryId: request.labId,
          userId: request.userId,
          action: 'BIOMNI_QUERY_CACHE_HIT',
          entity: 'BiomniQuery',
          entityId: queryId,
          details: { cacheHit: true }
        })
        return cachedResult
      }

      // Queue management for high load
      if (this.activeQueries.size >= this.config.maxConcurrentQueries) {
        this.queryQueue.set(queryId, request)
        await this.waitForQueuePosition(queryId)
      }

      this.activeQueries.add(queryId)

      const result = await this.executeWithRetry(request, queryId)
      
      // Cache successful results
      this.cacheResult(queryId, result)

      // Log successful completion
      await this.auditLogService.log({
        laboratoryId: request.labId,
        userId: request.userId,
        action: 'BIOMNI_QUERY_COMPLETED',
        entity: 'BiomniQuery',
        entityId: queryId,
        details: {
          success: true,
          executionTime: result.executionTime,
          confidence: result.confidence,
          cost: result.cost,
          toolsUsed: result.toolsUsed.length,
          databasesQueried: result.databasesQueried.length
        }
      })

      return result

    } catch (error) {
      // Log error
      await this.auditLogService.log({
        laboratoryId: request.labId,
        userId: request.userId,
        action: 'BIOMNI_QUERY_FAILED',
        entity: 'BiomniQuery',
        entityId: queryId,
        details: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          executionTime: Date.now() - startTime
        }
      })

      throw error
    } finally {
      this.activeQueries.delete(queryId)
      this.processQueue()
    }
  }

  /**
   * Advanced proteomics analysis
   */
  async analyzeProteomics(data: {
    sequences: string[]
    structures?: string[]
    expressionData?: number[][]
    conditions: string[]
    analysisGoals: string[]
    userId: string
    labId: string
  }): Promise<BiomniResponse> {
    const request: BiomniRequest = {
      query: this.buildProteomicsQuery(data),
      context: 'proteomics_analysis',
      tools: [
        'protein_structure_prediction',
        'functional_annotation',
        'pathway_analysis',
        'interaction_network',
        'post_translational_modifications',
        'protein_folding_analysis'
      ],
      databases: [
        'UniProt',
        'PDB',
        'KEGG',
        'Reactome',
        'STRING',
        'Gene_Ontology'
      ],
      analysisType: 'proteomics',
      priority: 'high',
      userId: data.userId,
      labId: data.labId
    }

    return this.executeBiomniQuery(request)
  }

  /**
   * Advanced genomics analysis
   */
  async analyzeGenomics(data: {
    sequences: string[]
    variants?: any[]
    expressionProfiles?: number[][]
    clinicalData?: Record<string, any>
    analysisType: 'variant_calling' | 'expression_analysis' | 'genome_assembly' | 'annotation'
    userId: string
    labId: string
  }): Promise<BiomniResponse> {
    const request: BiomniRequest = {
      query: this.buildGenomicsQuery(data),
      context: 'genomics_analysis',
      tools: [
        'variant_annotation',
        'pathway_enrichment',
        'expression_analysis',
        'genome_alignment',
        'functional_prediction',
        'population_genetics'
      ],
      databases: [
        'GenBank',
        'dbSNP',
        'ClinVar',
        'GWAS_Catalog',
        'GTEx',
        'TCGA'
      ],
      analysisType: 'genomics',
      priority: 'high',
      userId: data.userId,
      labId: data.labId
    }

    return this.executeBiomniQuery(request)
  }

  /**
   * Generate experimental protocols
   */
  async generateProtocol(data: {
    objective: string
    sampleType: string
    techniques: string[]
    constraints?: string[]
    safetyRequirements?: string[]
    equipmentAvailable?: string[]
    userId: string
    labId: string
  }): Promise<{
    protocol: any
    validation: any
    recommendations: string[]
  }> {
    const request: BiomniRequest = {
      query: this.buildProtocolQuery(data),
      context: 'protocol_generation',
      tools: [
        'protocol_design',
        'method_validation',
        'safety_assessment',
        'equipment_optimization',
        'quality_control'
      ],
      databases: [
        'Protocols_io',
        'Nature_Protocols',
        'JoVE',
        'Cold_Spring_Harbor'
      ],
      analysisType: 'general',
      priority: 'high',
      userId: data.userId,
      labId: data.labId
    }

    const response = await this.executeBiomniQuery(request)
    
    return {
      protocol: this.parseProtocolFromResponse(response),
      validation: this.extractValidationData(response),
      recommendations: response.recommendations
    }
  }

  /**
   * Equipment optimization analysis
   */
  async analyzeEquipmentOptimization(data: {
    equipmentType: string
    model: string
    manufacturer: string
    calibrationHistory: any[]
    performanceData: any[]
    optimizationGoal: string
    userId: string
    labId: string
  }): Promise<BiomniResponse> {
    const request: BiomniRequest = {
      query: this.buildEquipmentOptimizationQuery(data),
      context: 'equipment_optimization',
      tools: [
        'equipment_analysis',
        'maintenance_planning',
        'cost_analysis',
        'performance_optimization'
      ],
      databases: [
        'equipment_specifications',
        'maintenance_records',
        'performance_benchmarks'
      ],
      analysisType: 'general',
      priority: 'medium',
      userId: data.userId,
      labId: data.labId
    }

    return this.executeBiomniQuery(request)
  }

  /**
   * Research insights generation
   */
  async generateResearchInsights(data: {
    researchArea: string
    hypothesis?: string
    objectives?: string[]
    userId: string
    labId: string
  }): Promise<BiomniResponse> {
    const request: BiomniRequest = {
      query: this.buildResearchInsightsQuery(data),
      context: 'research_insights',
      tools: [
        'literature_review',
        'hypothesis_generation',
        'experimental_design',
        'methodology_recommendation'
      ],
      databases: [
        'PubMed',
        'Nature',
        'Science',
        'Cell',
        'Research_Gate'
      ],
      analysisType: 'general',
      priority: 'medium',
      userId: data.userId,
      labId: data.labId
    }

    return this.executeBiomniQuery(request)
  }

  // Private helper methods

  private async executeWithRetry(request: BiomniRequest, queryId: string): Promise<BiomniResponse> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await this.executeBiomniProcess(request, queryId)
      } catch (error) {
        lastError = error as Error
        if (attempt < this.config.retryAttempts) {
          await this.delay(Math.pow(2, attempt) * 1000) // Exponential backoff
        }
      }
    }

    throw lastError || new Error('Unknown error during Biomni execution')
  }

  private async executeBiomniProcess(request: BiomniRequest, queryId: string): Promise<BiomniResponse> {
    const startTime = Date.now()

    return new Promise((resolve, reject) => {
      const pythonScript = this.generatePythonScript(request)
      
      const biomniProcess = spawn(this.config.pythonPath, ['-c', pythonScript], {
        cwd: this.config.biomniPath,
        env: {
          ...process.env,
          PYTHONPATH: this.config.biomniPath,
          BIOMNI_DATA_PATH: this.config.dataPath
        },
        timeout: this.config.timeoutMs
      })

      let output = ''
      let errorOutput = ''

      biomniProcess.stdout.on('data', (data) => {
        output += data.toString()
      })

      biomniProcess.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      biomniProcess.on('close', (code) => {
        const executionTime = Date.now() - startTime

        if (code === 0) {
          try {
            const result = this.parseOutput(output, executionTime, queryId)
            resolve(result)
          } catch (parseError) {
            reject(new Error(`Failed to parse Biomni response: ${parseError}`))
          }
        } else {
          reject(new Error(`Biomni process failed with code ${code}: ${errorOutput}`))
        }
      })

      biomniProcess.on('error', (error) => {
        reject(new Error(`Failed to start Biomni process: ${error.message}`))
      })
    })
  }

  private generatePythonScript(request: BiomniRequest): string {
    return `
import sys
import json
import traceback
from pathlib import Path

# Add Biomni to path
sys.path.append('${this.config.biomniPath}')

try:
    from biomni import Agent
    
    # Initialize Biomni agent
    agent = Agent(
        model='${this.config.llmModel}',
        data_path='${this.config.dataPath}'
    )
    
    # Configure tools and databases
    if ${JSON.stringify(request.tools)}:
        agent.set_tools(${JSON.stringify(request.tools)})
    
    if ${JSON.stringify(request.databases)}:
        agent.set_databases(${JSON.stringify(request.databases)})
    
    # Execute query
    result = agent.run(
        query="${request.query.replace(/"/g, '\\"')}",
        context="${request.context || ''}",
        metadata=${JSON.stringify(request.metadata || {})}
    )
    
    # Format response
    response = {
        "success": True,
        "result": result.text if hasattr(result, 'text') else str(result),
        "tools_used": result.tools_used if hasattr(result, 'tools_used') else [],
        "databases_queried": result.databases_queried if hasattr(result, 'databases_queried') else [],
        "confidence": result.confidence if hasattr(result, 'confidence') else 0.8,
        "cost": result.cost if hasattr(result, 'cost') else 0.0,
        "metadata": result.metadata if hasattr(result, 'metadata') else {}
    }
    
    print(json.dumps(response))
    
except Exception as e:
    error_response = {
        "success": False,
        "error": str(e),
        "traceback": traceback.format_exc()
    }
    print(json.dumps(error_response))
    sys.exit(1)
`
  }

  private parseOutput(output: string, executionTime: number, queryId: string): BiomniResponse {
    try {
      const rawResult = JSON.parse(output.trim())
      
      if (!rawResult.success) {
        throw new Error(rawResult.error || 'Unknown Biomni error')
      }

      const insights = this.extractInsights(rawResult.result)
      const recommendations = this.extractRecommendations(rawResult.result)
      const nextSteps = this.generateNextSteps(rawResult.result)

      return {
        id: queryId,
        result: rawResult.result,
        summary: this.generateSummary(rawResult.result),
        insights,
        recommendations,
        toolsUsed: rawResult.tools_used || [],
        databasesQueried: rawResult.databases_queried || [],
        confidence: rawResult.confidence || 0.8,
        executionTime,
        cost: rawResult.cost || 0.0,
        warnings: this.extractWarnings(rawResult.result),
        nextSteps,
        dataQuality: this.assessDataQuality(rawResult)
      }
    } catch (error) {
      throw new Error(`Failed to parse Biomni output: ${error}`)
    }
  }

  // Query builders
  private buildProteomicsQuery(data: any): string {
    return `
Perform comprehensive proteomics analysis:

Protein Sequences: ${data.sequences.length} sequences provided
Structural Data: ${data.structures ? 'Available' : 'Not provided'}
Expression Data: ${data.expressionData ? 'Available' : 'Not provided'}
Experimental Conditions: ${data.conditions.join(', ')}

Analysis Goals:
${data.analysisGoals.map((goal: string) => `- ${goal}`).join('\n')}

Please provide:
1. Functional annotation and classification
2. Pathway analysis and enrichment
3. Protein-protein interaction networks
4. Structural predictions and validation
5. Post-translational modification analysis
6. Quality control assessment
7. Statistical analysis and significance testing
8. Biological interpretation and recommendations
`
  }

  private buildGenomicsQuery(data: any): string {
    return `
Perform comprehensive genomics analysis:

Sequence Data: ${data.sequences.length} sequences
Variant Data: ${data.variants ? data.variants.length + ' variants' : 'Not provided'}
Expression Profiles: ${data.expressionProfiles ? 'Available' : 'Not provided'}
Clinical Data: ${data.clinicalData ? 'Available' : 'Not provided'}
Analysis Type: ${data.analysisType}

Please provide:
1. Variant annotation and effect prediction
2. Pathway enrichment analysis
3. Gene expression analysis
4. Population genetics assessment
5. Clinical significance evaluation
6. Functional impact prediction
7. Quality metrics and validation
8. Therapeutic recommendations
`
  }

  private buildProtocolQuery(data: any): string {
    return `
Generate a detailed experimental protocol:

Objective: ${data.objective}
Sample Type: ${data.sampleType}
Techniques: ${data.techniques.join(', ')}

Constraints: ${data.constraints?.join(', ') || 'None specified'}
Safety Requirements: ${data.safetyRequirements?.join(', ') || 'Standard laboratory safety'}
Available Equipment: ${data.equipmentAvailable?.join(', ') || 'Standard laboratory equipment'}

Please provide:
1. Detailed step-by-step protocol
2. Required reagents and materials
3. Equipment specifications
4. Safety considerations and PPE requirements
5. Quality control measures
6. Expected results and interpretation
7. Troubleshooting guide
8. Validation recommendations
`
  }

  private buildEquipmentOptimizationQuery(data: any): string {
    return `
Analyze equipment performance and provide optimization recommendations:

Equipment Details:
- Type: ${data.equipmentType}
- Model: ${data.model}
- Manufacturer: ${data.manufacturer}

Recent Calibration History:
${data.calibrationHistory.map((cal: any, index: number) => 
  `- Calibration ${index + 1}: Status: ${cal.status}, Date: ${cal.date}, Notes: ${cal.notes || 'None'}`
).join('\n')}

Performance Data:
${data.performanceData.map((perf: any, index: number) =>
  `- Metric ${index + 1}: ${JSON.stringify(perf)}`
).join('\n')}

Optimization Goal: ${data.optimizationGoal}

Please provide:
1. Performance analysis and trends
2. Optimization recommendations
3. Preventive maintenance suggestions
4. Cost-benefit analysis
5. Risk assessment
6. Implementation timeline
7. Expected improvements
8. Monitoring recommendations
`
  }

  private buildResearchInsightsQuery(data: any): string {
    return `
Generate research insights and recommendations:

Research Area: ${data.researchArea}
Hypothesis: ${data.hypothesis || 'Not specified'}

Objectives:
${data.objectives?.map((obj: string) => `- ${obj}`).join('\n') || 'Not specified'}

Please provide:
1. Current state of research in this area
2. Key findings from recent literature
3. Recommended methodologies
4. Potential experimental approaches
5. Expected challenges and solutions
6. Resource requirements
7. Timeline considerations
8. Success metrics and validation
`
  }

  // Utility methods
  private extractInsights(result: string): string[] {
    const insights: string[] = []
    const patterns = [
      /(?:insight|finding|discovery|observation):\s*(.+?)(?=\n|\.)/gi,
      /(?:key finding|important note|notable result):\s*(.+?)(?=\n|\.)/gi
    ]

    patterns.forEach(pattern => {
      const matches = result.match(pattern)
      if (matches) {
        insights.push(...matches.map(match => match.replace(/^[^:]+:\s*/, '').trim()))
      }
    })

    return insights.length > 0 ? insights.slice(0, 10) : ['Analysis completed successfully']
  }

  private extractRecommendations(result: string): string[] {
    const recommendations: string[] = []
    
    if (result.toLowerCase().includes('recommend')) {
      const lines = result.split('\n').filter(line => 
        line.toLowerCase().includes('recommend') && line.trim().length > 10
      )
      recommendations.push(...lines.slice(0, 5))
    }

    return recommendations.length > 0 ? recommendations : ['Review analysis results and consider next steps']
  }

  private generateNextSteps(result: string): string[] {
    const steps = [
      'Review analysis results thoroughly',
      'Validate findings with additional experiments',
      'Document methodology and results',
      'Share findings with research team',
      'Plan follow-up investigations'
    ]

    return steps.slice(0, 3)
  }

  private extractWarnings(result: string): string[] {
    const warnings: string[] = []
    const patterns = [
      /warning:\s*(.+?)(?=\n|\.)/gi,
      /caution:\s*(.+?)(?=\n|\.)/gi,
      /note:\s*(.+?)(?=\n|\.)/gi
    ]

    patterns.forEach(pattern => {
      const matches = result.match(pattern)
      if (matches) {
        warnings.push(...matches.map(match => match.replace(/^[^:]+:\s*/, '').trim()))
      }
    })

    return warnings.slice(0, 5)
  }

  private generateSummary(result: string): string {
    const sentences = result.split('.').filter(s => s.trim().length > 20)
    if (sentences.length >= 2) {
      return sentences.slice(0, 2).join('. ') + '.'
    }
    return result.substring(0, 200) + (result.length > 200 ? '...' : '')
  }

  private assessDataQuality(rawResult: any): any {
    return {
      completeness: rawResult.confidence || 0.8,
      accuracy: rawResult.confidence || 0.8,
      consistency: 0.85,
      reliability: rawResult.confidence || 0.8,
      issues: rawResult.confidence < 0.7 ? ['Lower confidence indicates potential issues'] : [],
      recommendations: rawResult.confidence < 0.7 ? ['Consider additional data validation'] : []
    }
  }

  private parseProtocolFromResponse(response: BiomniResponse): any {
    return {
      name: 'AI-Generated Protocol',
      description: response.summary,
      steps: response.result.split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 10)
        .map((step, index) => ({
          id: index + 1,
          title: `Step ${index + 1}`,
          description: step.trim(),
          duration: '10-15 minutes'
        })),
      reagents: [],
      equipment: [],
      safetyConsiderations: response.warnings.map(warning => ({
        category: 'General Safety',
        description: warning,
        ppe: 'Standard laboratory PPE'
      }))
    }
  }

  private extractValidationData(response: BiomniResponse): any {
    return {
      confidence: response.confidence,
      dataQuality: response.dataQuality,
      validationMethods: response.recommendations
    }
  }

  private generateQueryId(request: BiomniRequest): string {
    const hash = crypto.createHash('md5')
    hash.update(JSON.stringify({
      query: request.query.substring(0, 100),
      analysisType: request.analysisType,
      timestamp: Date.now()
    }))
    return `biomni_${Date.now()}_${hash.digest('hex').substring(0, 8)}`
  }

  private getCachedResult(queryId: string): BiomniResponse | null {
    const cached = this.cache.get(queryId)
    if (cached && Date.now() - cached.timestamp < this.config.cacheDurationMs) {
      return cached.response
    }
    if (cached) {
      this.cache.delete(queryId)
    }
    return null
  }

  private cacheResult(queryId: string, response: BiomniResponse): void {
    this.cache.set(queryId, { response, timestamp: Date.now() })
  }

  private async waitForQueuePosition(queryId: string): Promise<void> {
    return new Promise((resolve) => {
      const checkQueue = () => {
        if (this.activeQueries.size < this.config.maxConcurrentQueries) {
          resolve()
        } else {
          setTimeout(checkQueue, 1000)
        }
      }
      checkQueue()
    })
  }

  private processQueue(): void {
    if (this.queryQueue.size > 0 && this.activeQueries.size < this.config.maxConcurrentQueries) {
      const [firstQueryId] = this.queryQueue.keys()
      const request = this.queryQueue.get(firstQueryId)
      if (request) {
        this.queryQueue.delete(firstQueryId)
        this.executeBiomniQuery(request).catch(console.error)
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default BiomniService 