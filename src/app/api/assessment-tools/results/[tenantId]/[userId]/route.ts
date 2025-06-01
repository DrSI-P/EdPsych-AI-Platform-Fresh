import { NextRequest, NextResponse } from 'next/server';
import { AssessmentToolService } from '@/lib/integration/assessment-tools/assessment-tool-service';

/**
 * User Assessment Results Endpoint
 * 
 * This endpoint retrieves assessment results for a user.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; userId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const userId = params.userId;
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const assessmentId = searchParams.get('assessmentId') || undefined;
    const contextId = searchParams.get('contextId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // Get user assessment results
    const assessmentToolService = AssessmentToolService.getInstance();
    const results = await assessmentToolService.getUserAssessmentResults(
      tenantId,
      userId,
      assessmentId,
      contextId,
      limit,
      offset
    );
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error getting user assessment results:', error);
    
    return NextResponse.json(
      { error: 'Failed to get user assessment results' },
      { status: 500 }
    );
  }
}
