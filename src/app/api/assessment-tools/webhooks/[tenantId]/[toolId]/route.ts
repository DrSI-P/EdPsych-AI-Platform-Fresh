import { NextRequest, NextResponse } from 'next/server';
import { AssessmentToolService } from '@/lib/integration/assessment-tools/assessment-tool-service';

/**
 * Assessment Tool Webhook Endpoint
 * 
 * This endpoint handles webhook events from assessment tools.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string; toolId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const toolId = params.toolId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.eventType || !body.payload) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Handle webhook event
    const assessmentToolService = AssessmentToolService.getInstance();
    const success = await assessmentToolService.handleWebhookEvent(
      tenantId,
      toolId,
      body.eventType,
      body.payload
    );
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    
    return NextResponse.json(
      { error: 'Failed to handle webhook event' },
      { status: 500 }
    );
  }
}
