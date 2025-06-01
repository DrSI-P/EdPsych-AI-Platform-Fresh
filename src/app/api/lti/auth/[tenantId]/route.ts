import { NextRequest, NextResponse } from 'next/server';
import { LTIService } from '@/lib/integration/lms/lti-service';

/**
 * LTI Authentication Response Endpoint
 * 
 * This endpoint handles the OIDC authentication response from an LMS.
 * It's the second step in the LTI 1.3 authentication flow.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const formData = await req.formData();
    
    // Extract required parameters
    const authResponse = {
      id_token: formData.get('id_token')?.toString(),
      state: formData.get('state')?.toString()
    };
    
    // Validate required parameters
    if (!authResponse.id_token || !authResponse.state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Handle authentication response
    const ltiService = LTIService.getInstance();
    const ltiData = await ltiService.handleAuthResponse(authResponse, tenantId);
    
    // Store LTI data in session and redirect to appropriate page
    // based on the LTI message type
    
    if (ltiData.type === 'resource_link') {
      // Redirect to the resource
      return NextResponse.redirect(new URL(`/lti/resource/${ltiData.resourceId}`, req.url));
    } else if (ltiData.type === 'deep_linking') {
      // Redirect to the content selector
      return NextResponse.redirect(new URL(`/lti/deep-linking/${tenantId}`, req.url));
    } else if (ltiData.type === 'submission_review') {
      // Redirect to the submission review
      return NextResponse.redirect(new URL(`/lti/submission/${ltiData.submissionId}`, req.url));
    } else {
      return NextResponse.json(
        { error: 'Unsupported LTI message type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error handling LTI authentication response:', error);
    
    return NextResponse.json(
      { error: 'Failed to process LTI authentication' },
      { status: 500 }
    );
  }
}
