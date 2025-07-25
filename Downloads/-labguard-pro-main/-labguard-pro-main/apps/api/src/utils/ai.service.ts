import OpenAI from 'openai'
import { PrismaClient } from '@labguard/database'
import { logger } from './logger'

const prisma = new PrismaClient()

interface AIValidationRequest {
  equipmentId: string
  templateId: string
  measurements: Record<string, any>
  environmentalConditions: Record<string, any>
  standardsUsed: Record<string, any>
  userId: string
  laboratoryId: string
}

interface AIValidationResponse {
  status: 'PASS' | 'FAIL' | 'CONDITIONAL'
  complianceScore: number
  performanceSummary: string
  correctiveActions: string[]
  nextVerificationDue: string
  deviations: string[]
  recommendations: string[]
  confidence: number
}

interface TemplateVariable {
  name: string
  value: string
  description: string
}

class AIService {
  private openai: OpenAI
  private maxRetries = 3
  private retryDelay = 1000

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  /**
   * Validate calibration data using AI
   */
  async validateCalibration(request: AIValidationRequest): Promise<AIValidationResponse> {
    try {
      // Get equipment and template data
      const [equipment, template] = await Promise.all([
        prisma.equipment.findUnique({
          where: { id: request.equipmentId },
          include: { laboratory: true }
        }),
        prisma.complianceTemplate.findUnique({
          where: { id: request.templateId }
        })
      ])

      if (!equipment || !template) {
        throw new Error('Equipment or template not found')
      }

      // Get user performing calibration
      const user = await prisma.user.findUnique({
        where: { id: request.userId }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Prepare template variables
      const variables = this.prepareTemplateVariables({
        equipment,
        template,
        measurements: request.measurements,
        environmentalConditions: request.environmentalConditions,
        standardsUsed: request.standardsUsed,
        user,
        laboratory: equipment.laboratory
      })

      // Substitute variables in template
      const prompt = this.substituteVariables(template.promptTemplate, variables)

      // Call OpenAI API
      const aiResponse = await this.callOpenAI(prompt)

      // Parse and validate AI response
      const validationResult = this.parseAIResponse(aiResponse)

      // Track usage
      await this.trackUsage(request.userId, request.laboratoryId, aiResponse.usage)

      return validationResult

    } catch (error) {
      logger.error('AI validation failed:', error)
      throw new Error(`AI validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Prepare template variables for substitution
   */
  private prepareTemplateVariables(data: {
    equipment: any
    template: any
    measurements: Record<string, any>
    environmentalConditions: Record<string, any>
    standardsUsed: Record<string, any>
    user: any
    laboratory: any
  }): TemplateVariable[] {
    const variables: TemplateVariable[] = []

    // Equipment variables
    variables.push({ name: 'EQUIPMENT_ID', value: data.equipment.id, description: 'Equipment ID' })
    variables.push({ name: 'MODEL_SERIAL', value: `${data.equipment.model}/${data.equipment.serialNumber}`, description: 'Model and Serial Number' })
    variables.push({ name: 'EQUIPMENT_TYPE', value: data.equipment.equipmentType, description: 'Equipment Type' })
    variables.push({ name: 'LOCATION', value: data.equipment.location || 'Not specified', description: 'Equipment Location' })

    // Calibration dates
    const lastCalibration = data.equipment.calibrationRecords?.[0]?.performedDate
    const nextCalibration = data.equipment.nextCalibrationAt
    variables.push({ name: 'LAST_CAL_DATE', value: lastCalibration ? new Date(lastCalibration).toLocaleDateString() : 'Never', description: 'Last Calibration Date' })
    variables.push({ name: 'NEXT_CAL_DATE', value: nextCalibration ? new Date(nextCalibration).toLocaleDateString() : 'Not scheduled', description: 'Next Calibration Date' })

    // User variables
    variables.push({ name: 'OPERATOR_NAME', value: data.user.name || data.user.email, description: 'Operator Name' })
    variables.push({ name: 'OPERATOR_ID', value: data.user.id, description: 'Operator ID' })

    // Laboratory variables
    variables.push({ name: 'LAB_NAME', value: data.laboratory.name, description: 'Laboratory Name' })
    variables.push({ name: 'LAB_ID', value: data.laboratory.id, description: 'Laboratory ID' })

    // Measurement variables
    if (data.measurements.linearity) {
      variables.push({ name: 'LINEARITY_DATA', value: JSON.stringify(data.measurements.linearity), description: 'Linearity Check Results' })
    }
    if (data.measurements.repeatability) {
      variables.push({ name: 'REPEATABILITY_VALUES', value: JSON.stringify(data.measurements.repeatability), description: 'Repeatability Values' })
    }
    if (data.measurements.accuracy) {
      variables.push({ name: 'ACCURACY_DEVIATION', value: JSON.stringify(data.measurements.accuracy), description: 'Accuracy Deviation' })
    }

    // Environmental conditions
    if (data.environmentalConditions.temperature || data.environmentalConditions.humidity) {
      const temp = data.environmentalConditions.temperature || 'Not recorded'
      const humidity = data.environmentalConditions.humidity || 'Not recorded'
      variables.push({ name: 'TEMP_HUMIDITY', value: `Temperature: ${temp}°C, Humidity: ${humidity}%`, description: 'Environmental Conditions' })
    }

    // Standards used
    if (data.standardsUsed.referenceWeights) {
      variables.push({ name: 'REFERENCE_WEIGHTS', value: JSON.stringify(data.standardsUsed.referenceWeights), description: 'Reference Weights Used' })
    }

    // Vibration status
    if (data.environmentalConditions.vibration) {
      variables.push({ name: 'VIBRATION_STATUS', value: data.environmentalConditions.vibration, description: 'Vibration Level' })
    }

    return variables
  }

  /**
   * Substitute variables in template
   */
  private substituteVariables(template: string, variables: TemplateVariable[]): string {
    let result = template

    for (const variable of variables) {
      const placeholder = `{${variable.name}}`
      result = result.replace(new RegExp(placeholder, 'g'), variable.value)
    }

    return result
  }

  /**
   * Call OpenAI API with retry logic
   */
  private async callOpenAI(prompt: string): Promise<any> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a precision measurement compliance agent for analytical equipment validation. Provide structured, accurate responses for laboratory compliance checking.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
          temperature: 0.1, // Low temperature for consistent, factual responses
          response_format: { type: 'json_object' }
        })

        return {
          content: completion.choices[0]?.message?.content,
          usage: completion.usage
        }

      } catch (error) {
        lastError = error as Error
        logger.warn(`OpenAI API attempt ${attempt} failed:`, error)

        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt))
        }
      }
    }

    throw new Error(`OpenAI API failed after ${this.maxRetries} attempts: ${lastError?.message}`)
  }

  /**
   * Parse AI response into structured format
   */
  private parseAIResponse(response: any): AIValidationResponse {
    try {
      const content = response.content
      if (!content) {
        throw new Error('Empty AI response')
      }

      // Try to parse as JSON first
      let parsed
      try {
        parsed = JSON.parse(content)
      } catch {
        // If not JSON, try to extract structured information
        parsed = this.extractStructuredInfo(content)
      }

      return {
        status: parsed.calibration_status || parsed.status || 'CONDITIONAL',
        complianceScore: parsed.compliance_score || parsed.score || 0,
        performanceSummary: parsed.performance_summary || parsed.summary || 'Analysis completed',
        correctiveActions: Array.isArray(parsed.corrective_actions) ? parsed.corrective_actions : [],
        nextVerificationDue: parsed.next_verification_due || parsed.next_check || 'To be determined',
        deviations: Array.isArray(parsed.deviations) ? parsed.deviations : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        confidence: parsed.confidence || 0.8
      }

    } catch (error) {
      logger.error('Failed to parse AI response:', error)
      // Return a safe default response
      return {
        status: 'CONDITIONAL',
        complianceScore: 50,
        performanceSummary: 'AI analysis completed but response parsing failed',
        correctiveActions: ['Review calibration data manually'],
        nextVerificationDue: 'Schedule manual review',
        deviations: ['AI response parsing error'],
        recommendations: ['Contact support for assistance'],
        confidence: 0.5
      }
    }
  }

  /**
   * Extract structured information from text response
   */
  private extractStructuredInfo(content: string): any {
    const result: any = {}

    // Extract status
    const statusMatch = content.match(/CALIBRATION STATUS:\s*(PASS|FAIL|CONDITIONAL)/i)
    if (statusMatch) {
      result.status = statusMatch[1].toUpperCase()
    }

    // Extract compliance score
    const scoreMatch = content.match(/COMPLIANCE SCORE:\s*(\d+(?:\.\d+)?)/i)
    if (scoreMatch) {
      result.compliance_score = parseFloat(scoreMatch[1])
    }

    // Extract performance summary
    const summaryMatch = content.match(/PERFORMANCE SUMMARY:\s*([^\n]+)/i)
    if (summaryMatch) {
      result.performance_summary = summaryMatch[1].trim()
    }

    // Extract corrective actions
    const actionsMatch = content.match(/CORRECTIVE ACTIONS:\s*([^\n]+)/i)
    if (actionsMatch) {
      result.corrective_actions = [actionsMatch[1].trim()]
    }

    return result
  }

  /**
   * Track AI usage for billing
   */
  private async trackUsage(userId: string, laboratoryId: string, usage: any): Promise<void> {
    try {
      const tokenCount = usage?.total_tokens || 0
      const cost = this.calculateCost(tokenCount)

      await prisma.usageRecord.create({
        data: {
          feature: 'ai_compliance_check',
          quantity: tokenCount,
          cost: cost,
          metadata: {
            model: process.env.OPENAI_MODEL || 'gpt-4',
            promptTokens: usage?.prompt_tokens || 0,
            completionTokens: usage?.completion_tokens || 0
          },
          subscription: {
            connect: {
              laboratoryId: laboratoryId
            }
          }
        }
      })

      logger.info(`AI usage tracked: ${tokenCount} tokens, $${cost}`)

    } catch (error) {
      logger.error('Failed to track AI usage:', error)
      // Don't throw - usage tracking failure shouldn't break the main flow
    }
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(tokenCount: number): number {
    const model = process.env.OPENAI_MODEL || 'gpt-4'
    
    // Approximate costs per 1K tokens (these would need to be updated based on actual OpenAI pricing)
    const costs: Record<string, { input: number, output: number }> = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    }

    const modelCosts = costs[model] || costs['gpt-4']
    return (tokenCount / 1000) * modelCosts.input // Simplified calculation
  }

  /**
   * Get available compliance templates
   */
  async getTemplates(laboratoryId: string): Promise<any[]> {
    try {
      const templates = await prisma.complianceTemplate.findMany({
        where: {
          laboratoryId: laboratoryId,
          isActive: true,
          deletedAt: null
        },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          version: true,
          usage_count: true,
          createdAt: true
        },
        orderBy: {
          usage_count: 'desc'
        }
      })

      return templates

    } catch (error) {
      logger.error('Failed to get templates:', error)
      throw new Error('Failed to retrieve compliance templates')
    }
  }

  /**
   * Create custom compliance template
   */
  async createTemplate(data: {
    name: string
    description?: string
    category: string
    promptTemplate: string
    variables: string[]
    safetyChecks: string[]
    acceptanceCriteria: Record<string, any>
    laboratoryId: string
  }): Promise<any> {
    try {
      const template = await prisma.complianceTemplate.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          promptTemplate: data.promptTemplate,
          variables: data.variables,
          safetyChecks: data.safetyChecks,
          acceptanceCriteria: data.acceptanceCriteria,
          laboratoryId: data.laboratoryId
        }
      })

      logger.info(`Created new compliance template: ${template.id}`)
      return template

    } catch (error) {
      logger.error('Failed to create template:', error)
      throw new Error('Failed to create compliance template')
    }
  }

  /**
   * Get AI usage statistics
   */
  async getUsageStats(laboratoryId: string, period: 'day' | 'week' | 'month' = 'month'): Promise<any> {
    try {
      const now = new Date()
      const startDate = new Date()

      switch (period) {
        case 'day':
          startDate.setDate(now.getDate() - 1)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
      }

      const usage = await prisma.usageRecord.groupBy({
        by: ['feature'],
        where: {
          subscription: {
            laboratoryId: laboratoryId
          },
          recordedAt: {
            gte: startDate
          }
        },
        _sum: {
          quantity: true,
          cost: true
        },
        _count: true
      })

      return {
        period,
        totalTokens: usage.reduce((sum, record) => sum + (record._sum.quantity || 0), 0),
        totalCost: usage.reduce((sum, record) => sum + (record._sum.cost || 0), 0),
        totalRequests: usage.reduce((sum, record) => sum + record._count, 0),
        breakdown: usage
      }

    } catch (error) {
      logger.error('Failed to get usage stats:', error)
      throw new Error('Failed to retrieve usage statistics')
    }
  }
}

export const aiService = new AIService()
export default aiService 