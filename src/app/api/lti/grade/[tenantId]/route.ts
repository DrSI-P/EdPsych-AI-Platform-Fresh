import { NextRequest, NextResponse } from 'next/server';
import { LTIService } from '@/lib/integration/lms/lti-service';

/**
 * LTI Grade Passback Endpoint
 * 
 * This endpoint sends grade/score information back to the LMS
 * using the Assignment and Grade Services (AGS) in LTI 1.3.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.resourceLinkId || !body.userId || 
        body.scoreGiven === undefined || body.scoreMaximum === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Send grade to LMS
    const ltiService = LTIService.getInstance();
    const success = await ltiService.sendGradeToLMS(body, tenantId);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send grade to LMS' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending grade to LMS:', error);
    
    return NextResponse.json(
      { error: 'Failed to send grade to LMS' },
      { status: 500 }
    );
  }
}
