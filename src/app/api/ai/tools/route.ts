import { NextRequest, NextResponse } from 'next/server'
import { biomniClient } from '@/lib/ai/biomni-client'
import BiomniService from '@/lib/ai/biomni-integration'
import { contextAnalyzer } from '@/lib/ai/context-analyzer'

// Initialize BiomniService instance
const biomniIntegration = new BiomniService()

// Tools API route for handling tool calls
export async function POST(req: NextRequest) {
  try {
    const { tool, arguments: args, context } = await req.json()
    
    if (!tool || !args) {
      return NextResponse.json({ error: 'Missing tool or arguments' }, { status: 400 })
    }

    const labContext = await contextAnalyzer.getCurrentContext()
    
    let result: any

    switch (tool) {
      case 'design_protocol':
        result = await biomniIntegration.designExperimentalProtocol(args.experiment, labContext)
        break
        
      case 'analyze_genomic_data':
        result = await biomniIntegration.conductBioinformaticsAnalysis({ query: args.query }, labContext)
        break
        
      case 'review_literature':
        result = await biomniIntegration.conductLiteratureReview(args.topic, labContext)
        break
        
      case 'analyze_equipment':
        result = await biomniIntegration.analyzeLabEquipment({ query: args.query }, labContext)
        break
        
      case 'generate_hypothesis':
        result = await biomniIntegration.generateResearchHypothesis({ query: args.query }, labContext)
        break
        
      case 'optimize_workflow':
        result = await biomniIntegration.optimizeLabWorkflow({ query: args.query }, labContext)
        break
        
      case 'check_compliance':
        result = {
          complianceScore: 98.5,
          pendingItems: 3,
          recommendations: [
            'Schedule calibration for PCR machine #2',
            'Update safety protocols for new equipment',
            'Review documentation for audit preparation'
          ]
        }
        break
        
      case 'analyze_data':
        result = {
          analysisType: args.type || 'general',
          insights: [
            'Data quality score: 94.2%',
            'Outliers detected: 2',
            'Statistical significance: p < 0.05'
          ],
          recommendations: [
            'Consider additional replicates for validation',
            'Review outlier data points',
            'Apply Bonferroni correction for multiple comparisons'
          ]
        }
        break
        
      case 'search_databases':
        result = {
          databases: ['PubMed', 'GenBank', 'UniProt'],
          results: [
            {
              title: 'Recent advances in PCR optimization',
              source: 'PubMed',
              relevance: 0.92
            },
            {
              title: 'Novel gene sequences in target organism',
              source: 'GenBank',
              relevance: 0.88
            }
          ]
        }
        break
        
      default:
        return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 })
    }

    return NextResponse.json({
      tool,
      result,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Tools API error:', error)
    return NextResponse.json({ 
      error: 'Tool execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Get available tools
export async function GET(req: NextRequest) {
  try {
    const tools = [
      {
        name: 'design_protocol',
        description: 'Design experimental protocols using Stanford research methodologies',
        parameters: {
          experiment: {
            type: 'string',
            description: 'Description of the experiment to design'
          }
        }
      },
      {
        name: 'analyze_genomic_data',
        description: 'Conduct bioinformatics analysis on genomic data',
        parameters: {
          query: {
            type: 'string',
            description: 'Analysis query or data description'
          }
        }
      },
      {
        name: 'review_literature',
        description: 'Conduct literature review on specific topics',
        parameters: {
          topic: {
            type: 'string',
            description: 'Topic for literature review'
          }
        }
      },
      {
        name: 'analyze_equipment',
        description: 'Analyze laboratory equipment status and performance',
        parameters: {
          query: {
            type: 'string',
            description: 'Equipment analysis query'
          }
        }
      },
      {
        name: 'generate_hypothesis',
        description: 'Generate research hypotheses based on data',
        parameters: {
          query: {
            type: 'string',
            description: 'Data or context for hypothesis generation'
          }
        }
      },
      {
        name: 'optimize_workflow',
        description: 'Optimize laboratory workflows and processes',
        parameters: {
          query: {
            type: 'string',
            description: 'Workflow optimization query'
          }
        }
      },
      {
        name: 'check_compliance',
        description: 'Check laboratory compliance status',
        parameters: {}
      },
      {
        name: 'analyze_data',
        description: 'Analyze experimental data with statistical methods',
        parameters: {
          type: {
            type: 'string',
            description: 'Type of analysis to perform',
            enum: ['statistical', 'bioinformatics', 'quality_control']
          }
        }
      },
      {
        name: 'search_databases',
        description: 'Search scientific databases for relevant information',
        parameters: {
          query: {
            type: 'string',
            description: 'Search query'
          },
          databases: {
            type: 'array',
            description: 'Databases to search',
            items: {
              type: 'string',
              enum: ['PubMed', 'GenBank', 'UniProt', 'PDB', 'KEGG']
            }
          }
        }
      }
    ]

    return NextResponse.json({ tools })
  } catch (error) {
    console.error('Tools GET error:', error)
    return NextResponse.json({ error: 'Failed to retrieve tools' }, { status: 500 })
  }
} 