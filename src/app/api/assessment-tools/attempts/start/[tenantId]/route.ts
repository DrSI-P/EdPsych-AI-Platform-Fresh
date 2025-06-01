import { NextRequest, NextResponse } from 'next/server';
import { AssessmentToolService } from '@/lib/integration/assessment-tools/assessment-tool-service';

/**
 * Start Assessment Attempt Endpoint
 * 
 * This endpoint starts a new assessment attempt for a user.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.assessmentId || !body.userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Start assessment attempt
    const assessmentToolService = AssessmentToolService.getInstance();
    const attemptId = await assessmentToolService.startAssessmentAttempt(
      tenantId,
      body.assessmentId,
      body.userId,
      body.contextId
    );
    
    return NextResponse.json({ attemptId });
  } catch (error) {
    console.error('Error starting assessment attempt:', error);
    
    return NextResponse.json(
      { error: 'Failed to start assessment attempt' },
      { status: 500 }
    );
  }
}
