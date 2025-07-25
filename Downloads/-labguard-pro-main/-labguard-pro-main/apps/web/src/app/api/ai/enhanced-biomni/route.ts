import { NextRequest, NextResponse } from 'next/server';
import { enhancedBiomniAgent, MultiModalInput, AgenticTask } from '@/lib/ai/enhanced-biomni-agent';
import { withRateLimit } from '@/lib/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Rate limiting for AI endpoints
const aiRateLimiter = withRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  keyGenerator: (req: NextRequest) => {
    const session = getServerSession(authOptions);
    return session?.user?.id || req.ip || 'anonymous';
  }
});

export async function POST(request: NextRequest) {
  return aiRateLimiter(request, async () => {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const body = await request.json();
      const { action, data, context } = body;

      // Update lab context with user information
      const labContext = {
        ...context,
        userId: session.user.id,
        userRole: session.user.role || 'researcher',
        labId: session.user.labId || 'default-lab',
        timestamp: Date.now()
      };

      enhancedBiomniAgent.updateLabContext(labContext);

      let result;

      switch (action) {
        case 'process_multi_modal':
          result = await enhancedBiomniAgent.processMultiModalInput(data.inputs);
          break;

        case 'execute_agentic_task':
          result = await enhancedBiomniAgent.executeAgenticTask(data.task);
          break;

        case 'conduct_advanced_research':
          result = await enhancedBiomniAgent.conductAdvancedResearch(data.query, labContext);
          break;

        case 'conduct_multi_modal_analysis':
          result = await enhancedBiomniAgent.conductMultiModalAnalysis(data.data, labContext);
          break;

        case 'design_experimental_protocol':
          result = await enhancedBiomniAgent.designExperimentalProtocol(data.experiment, labContext);
          break;

        case 'analyze_genomic_data':
          result = await enhancedBiomniAgent.analyzeGenomicData(data.data, labContext);
          break;

        case 'review_literature':
          result = await enhancedBiomniAgent.reviewLiterature(data.topic, labContext);
          break;

        case 'generate_hypothesis':
          result = await enhancedBiomniAgent.generateHypothesis(data.data, labContext);
          break;

        case 'monitor_equipment':
          result = await enhancedBiomniAgent.monitorEquipment();
          break;

        case 'predict_maintenance':
          result = await enhancedBiomniAgent.predictMaintenance();
          break;

        case 'check_compliance':
          result = await enhancedBiomniAgent.checkCompliance();
          break;

        case 'control_quality':
          result = await enhancedBiomniAgent.controlQuality();
          break;

        case 'optimize_workflow':
          result = await enhancedBiomniAgent.optimizeLabWorkflow(data.workflow, labContext);
          break;

        case 'get_capabilities':
          result = enhancedBiomniAgent.getCapabilities();
          break;

        case 'get_config':
          result = enhancedBiomniAgent.getConfig();
          break;

        case 'get_active_tasks':
          result = enhancedBiomniAgent.getActiveTasks();
          break;

        case 'update_config':
          enhancedBiomniAgent.updateConfig(data.config);
          result = { success: true, message: 'Configuration updated' };
          break;

        case 'update_lab_context':
          enhancedBiomniAgent.updateLabContext(data.context);
          result = { success: true, message: 'Lab context updated' };
          break;

        case 'check_availability':
          result = await enhancedBiomniAgent.checkAvailability();
          break;

        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        result,
        timestamp: Date.now(),
        session: {
          userId: session.user.id,
          userRole: session.user.role,
          labId: session.user.labId
        }
      });

    } catch (error) {
      console.error('Enhanced Biomni API error:', error);
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        },
        { status: 500 }
      );
    }
  });
}

export async function GET(request: NextRequest) {
  return aiRateLimiter(request, async () => {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(request.url);
      const action = searchParams.get('action');

      let result;

      switch (action) {
        case 'capabilities':
          result = enhancedBiomniAgent.getCapabilities();
          break;

        case 'config':
          result = enhancedBiomniAgent.getConfig();
          break;

        case 'active_tasks':
          result = enhancedBiomniAgent.getActiveTasks();
          break;

        case 'availability':
          result = await enhancedBiomniAgent.checkAvailability();
          break;

        case 'status':
          result = {
            capabilities: enhancedBiomniAgent.getCapabilities(),
            config: enhancedBiomniAgent.getConfig(),
            activeTasks: enhancedBiomniAgent.getActiveTasks(),
            availability: await enhancedBiomniAgent.checkAvailability(),
            timestamp: Date.now()
          };
          break;

        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        result,
        timestamp: Date.now(),
        session: {
          userId: session.user.id,
          userRole: session.user.role,
          labId: session.user.labId
        }
      });

    } catch (error) {
      console.error('Enhanced Biomni API error:', error);
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        },
        { status: 500 }
      );
    }
  });
}

// Handle file uploads for multi-modal processing
export async function PUT(request: NextRequest) {
  return aiRateLimiter(request, async () => {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const formData = await request.formData();
      const file = formData.get('file') as File;
      const type = formData.get('type') as string;
      const metadata = JSON.parse(formData.get('metadata') as string || '{}');

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Process file based on type
      const input: MultiModalInput = {
        type: type as 'text' | 'voice' | 'image' | 'file' | 'data' | 'sensor',
        content: file,
        metadata: {
          ...metadata,
          filename: file.name,
          size: file.size,
          type: file.type,
          timestamp: Date.now()
        }
      };

      const result = await enhancedBiomniAgent.processMultiModalInput([input]);

      return NextResponse.json({
        success: true,
        result,
        timestamp: Date.now(),
        session: {
          userId: session.user.id,
          userRole: session.user.role,
          labId: session.user.labId
        }
      });

    } catch (error) {
      console.error('Enhanced Biomni file upload error:', error);
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        },
        { status: 500 }
      );
    }
  });
} 