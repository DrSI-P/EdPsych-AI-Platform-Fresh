import { NextRequest, NextResponse } from 'next/server';
import { AssessmentToolService } from '@/lib/integration/assessment-tools/assessment-tool-service';

/**
 * Assessment Search Endpoint
 * 
 * This endpoint searches for assessments across all registered assessment tools.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Search for assessments
    const assessmentToolService = AssessmentToolService.getInstance();
    const searchResults = await assessmentToolService.searchAssessments(
      tenantId,
      body
    );
    
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Error searching assessments:', error);
    
    return NextResponse.json(
      { error: 'Failed to search assessments' },
      { status: 500 }
    );
  }
}
