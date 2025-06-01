import { NextRequest, NextResponse } from 'next/server';
import { LTIService } from '@/lib/integration/lms/lti-service';

/**
 * LTI Deep Linking Response Endpoint
 * 
 * This endpoint creates and sends a deep linking response back to the LMS
 * after content selection.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.deepLinkingRequest || !body.contentItems) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Create deep linking response
    const ltiService = LTIService.getInstance();
    const response = await ltiService.createDeepLinkingResponse(
      body.deepLinkingRequest,
      body.contentItems,
      tenantId
    );
    
    // Return the response data for the auto-submitting form
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating deep linking response:', error);
    
    return NextResponse.json(
      { error: 'Failed to create deep linking response' },
      { status: 500 }
    );
  }
}
