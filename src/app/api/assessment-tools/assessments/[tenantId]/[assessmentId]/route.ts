import { NextRequest, NextResponse } from 'next/server';
import { AssessmentToolService } from '@/lib/integration/assessment-tools/assessment-tool-service';

/**
 * Assessment Details Endpoint
 * 
 * This endpoint retrieves details for a specific assessment.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; assessmentId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const assessmentId = params.assessmentId;
    
    // Get assessment details
    const assessmentToolService = AssessmentToolService.getInstance();
    const assessment = await assessmentToolService.getAssessment(
      tenantId,
      assessmentId
    );
    
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error getting assessment:', error);
    
    return NextResponse.json(
      { error: 'Failed to get assessment' },
      { status: 500 }
    );
  }
}
