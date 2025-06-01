import { NextRequest, NextResponse } from 'next/server';
import { AssessmentToolService } from '@/lib/integration/assessment-tools/assessment-tool-service';

/**
 * Assessment Tool Registration Endpoint
 * 
 * This endpoint registers a new assessment tool for a tenant.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.name || !body.type || !body.baseUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Register assessment tool
    const assessmentToolService = AssessmentToolService.getInstance();
    const toolId = await assessmentToolService.registerAssessmentTool(
      tenantId,
      body
    );
    
    return NextResponse.json({ toolId });
  } catch (error) {
    console.error('Error registering assessment tool:', error);
    
    return NextResponse.json(
      { error: 'Failed to register assessment tool' },
      { status: 500 }
    );
  }
}
