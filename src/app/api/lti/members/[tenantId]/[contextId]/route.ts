import { NextRequest, NextResponse } from 'next/server';
import { LTIService } from '@/lib/integration/lms/lti-service';

/**
 * LTI Names and Roles Provisioning Service Endpoint
 * 
 * This endpoint retrieves the names and roles of users in a course
 * from the LMS using the Names and Roles Provisioning Service (NRPS) in LTI 1.3.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; contextId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const contextId = params.contextId;
    
    // Get names and roles from LMS
    const ltiService = LTIService.getInstance();
    const members = await ltiService.getNamesAndRoles(contextId, tenantId);
    
    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error getting names and roles from LMS:', error);
    
    return NextResponse.json(
      { error: 'Failed to get names and roles from LMS' },
      { status: 500 }
    );
  }
}
