import { NextRequest, NextResponse } from 'next/server';
import { AssessmentToolService } from '@/lib/integration/assessment-tools/assessment-tool-service';

/**
 * Submit Assessment Attempt Endpoint
 * 
 * This endpoint submits an assessment attempt with answers.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string; attemptId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const attemptId = params.attemptId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: 'Missing or invalid answers' },
        { status: 400 }
      );
    }
    
    // Submit assessment attempt
    const assessmentToolService = AssessmentToolService.getInstance();
    const result = await assessmentToolService.submitAssessmentAttempt(
      tenantId,
      attemptId,
      body.answers
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting assessment attempt:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit assessment attempt' },
      { status: 500 }
    );
  }
}
