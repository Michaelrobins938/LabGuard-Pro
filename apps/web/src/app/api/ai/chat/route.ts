import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

interface ChatRequest {
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

interface ChatResponse {
  response: string;
  complianceScore?: number;
  suggestions?: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const body: ChatRequest = await request.json();

    // Input validation
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Simulate AI processing based on message content
    const message = body.message.toLowerCase();
    let response: ChatResponse;

    if (message.includes('pcr') || message.includes('protocol')) {
      response = {
        response: "I can help you with PCR protocol compliance. Based on CAP guidelines, ensure your PCR protocols include proper temperature validation, reagent lot tracking, and quality control measures. Would you like me to review a specific protocol?",
        complianceScore: 85,
        suggestions: [
          "Review temperature calibration records",
          "Verify reagent expiration dates",
          "Check positive and negative controls"
        ]
      };
    } else if (message.includes('media') || message.includes('culture')) {
      response = {
        response: "For media validation, I recommend checking expiration dates, storage conditions, and performing regular quality control tests. All media should be tested for sterility and performance before use.",
        complianceScore: 78,
        suggestions: [
          "Perform sterility testing on new lots",
          "Document storage temperature logs",
          "Conduct performance testing with known organisms"
        ]
      };
    } else if (message.includes('audit') || message.includes('inspection')) {
      response = {
        response: "Audit preparation requires systematic documentation review. I can help you create checklists, identify potential compliance gaps, and prepare required documentation for CAP, CLIA, or other regulatory inspections.",
        complianceScore: 92,
        suggestions: [
          "Review proficiency testing records",
          "Update procedure manuals",
          "Verify staff competency records"
        ]
      };
    } else if (message.includes('result') || message.includes('validation')) {
      response = {
        response: "Result validation involves checking critical values, reference ranges, and quality control data. Ensure all results are reviewed by qualified personnel and critical values are promptly communicated.",
        complianceScore: 88,
        suggestions: [
          "Verify critical value notification",
          "Review QC trends",
          "Check result correlation studies"
        ]
      };
    } else {
      response = {
        response: "Hello! I'm your LabGuard Compliance Assistant. I can help you with PCR protocols, media validation, result verification, audit preparation, and safety incidents. What specific compliance topic would you like assistance with?",
        complianceScore: 90,
        suggestions: [
          "Ask about PCR protocol compliance",
          "Inquire about media validation procedures",
          "Request audit preparation guidance"
        ]
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 