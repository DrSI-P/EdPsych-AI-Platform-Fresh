import { NextRequest, NextResponse } from 'next/server';
import { LTIService } from '@/lib/integration/lms/lti-service';

/**
 * LTI Login Initiation Endpoint
 * 
 * This endpoint handles the OIDC login initiation from an LMS.
 * It's the first step in the LTI 1.3 authentication flow.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const searchParams = req.nextUrl.searchParams;
    
    // Extract required parameters
    const loginParams = {
      iss: searchParams.get('iss'),
      login_hint: searchParams.get('login_hint'),
      target_link_uri: searchParams.get('target_link_uri'),
      client_id: searchParams.get('client_id'),
      lti_message_hint: searchParams.get('lti_message_hint')
    };
    
    // Validate required parameters
    if (!loginParams.iss || !loginParams.login_hint || 
        !loginParams.target_link_uri || !loginParams.client_id) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Handle login initiation
    const ltiService = LTIService.getInstance();
    const authUrl = await ltiService.handleLoginInitiation(loginParams, tenantId);
    
    // Redirect to authentication URL
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error handling LTI login initiation:', error);
    
    return NextResponse.json(
      { error: 'Failed to process LTI login' },
      { status: 500 }
    );
  }
}
