import { Request, Response } from 'express'
import BiomniService from '../services/BiomniService'
import { PrismaClient } from '@labguard/database'

const biomniService = BiomniService
const prisma = new PrismaClient()

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user: {
    id: string
    laboratoryId: string
  }
}

export const getEquipmentOptimization = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { equipmentId } = req.params
    const { optimizationGoal } = req.body

    // Get equipment details
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        calibrationRecords: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' })
    }

    // Generate Biomni query for equipment optimization
    const query = `
      Analyze ${equipment.type} equipment performance and suggest optimization strategies.
      
      Equipment Details:
      - Model: ${equipment.model}
      - Manufacturer: ${equipment.manufacturer}
      - Current Status: ${equipment.status}
      - Location: ${equipment.location}
      
      Recent Calibration Data:
      ${equipment.calibrationRecords.map((cal: any) => 
        `- Date: ${cal.performedAt}, Status: ${cal.status}, Notes: ${cal.notes}`
      ).join('\n')}
      
      Optimization Goal: ${optimizationGoal}
      
      Please provide:
      1. Performance analysis
      2. Optimization recommendations
      3. Preventive maintenance suggestions
      4. Cost-benefit analysis
      5. Risk assessment
    `

    const result = await biomniService.executeBiomniQuery(
      query,
      ['equipment_analysis', 'maintenance_planning', 'cost_analysis'],
      ['equipment_specifications', 'maintenance_records'],
      'EQUIPMENT_OPTIMIZATION',
      req.user.id,
      req.user.laboratoryId
    )

    res.json({
      equipmentId,
      optimizationSuggestions: result,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Equipment optimization failed:', error)
    res.status(500).json({ error: 'Equipment optimization failed' })
  }
}

export const getMethodValidation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { method, parameters } = req.body

    const query = `
      Validate the following analytical method and parameters:
      
      Method: ${method.name}
      Description: ${method.description}
      
      Parameters:
      ${Object.entries(parameters).map(([key, value]) => 
        `- ${key}: ${value}`
      ).join('\n')}
      
      Please provide:
      1. Method validation assessment
      2. Parameter optimization suggestions
      3. Quality control recommendations
      4. Regulatory compliance check
      5. Literature references for validation
      6. Potential interferences and limitations
    `

    const result = await biomniService.executeBiomniQuery(
      query,
      ['method_validation', 'qc_analysis', 'regulatory_check'],
      ['analytical_methods', 'regulatory_guidelines', 'literature'],
      'COMPLIANCE_VALIDATION',
      req.user.id,
      req.user.laboratoryId
    )

    res.json({
      method: method.name,
      validationResults: result,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Method validation failed:', error)
    res.status(500).json({ error: 'Method validation failed' })
  }
}

export const getPredictiveMaintenance = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { equipmentId } = req.params

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        calibrationRecords: {
          take: 20,
          orderBy: { createdAt: 'desc' }
        },
        maintenance: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' })
    }

    const query = `
      Analyze maintenance patterns and predict future maintenance needs for ${equipment.name}.
      
      Equipment History:
      - Calibrations: ${equipment.calibrationRecords.length} records
      - Maintenance: ${equipment.maintenance.length} records
      - Current Status: ${equipment.status}
      
      Please provide:
      1. Maintenance prediction timeline
      2. Risk factors and indicators
      3. Cost optimization suggestions
      4. Preventive measures
      5. Performance degradation analysis
    `

    const result = await biomniService.executeBiomniQuery(
      query,
      ['predictive_analysis', 'maintenance_planning', 'risk_assessment'],
      ['maintenance_records', 'equipment_specifications'],
      'EQUIPMENT_OPTIMIZATION',
      req.user.id,
      req.user.laboratoryId
    )

    res.json({
      equipmentId,
      predictiveAnalysis: result,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Predictive maintenance analysis failed:', error)
    res.status(500).json({ error: 'Predictive maintenance analysis failed' })
  }
}

export const getPerformanceAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { equipmentId } = req.params
    const { timeRange } = req.query

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        calibrationRecords: {
          take: 50,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' })
    }

    const query = `
      Analyze performance metrics for ${equipment.name} over ${timeRange || 'the last 6 months'}.
      
      Equipment Details:
      - Type: ${equipment.type}
      - Model: ${equipment.model}
      - Calibration Records: ${equipment.calibrationRecords.length}
      
      Please provide:
      1. Performance trends analysis
      2. Efficiency metrics
      3. Bottleneck identification
      4. Optimization opportunities
      5. Benchmark comparisons
    `

    const result = await biomniService.executeBiomniQuery(
      query,
      ['performance_analysis', 'trend_analysis', 'benchmarking'],
      ['performance_metrics', 'equipment_specifications'],
      'DATA_ANALYSIS',
      req.user.id,
      req.user.laboratoryId
    )

    res.json({
      equipmentId,
      performanceAnalytics: result,
      timeRange: timeRange || '6 months',
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Performance analytics failed:', error)
    res.status(500).json({ error: 'Performance analytics failed' })
  }
} 