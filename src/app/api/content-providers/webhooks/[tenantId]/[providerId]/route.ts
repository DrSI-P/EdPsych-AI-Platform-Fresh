import { NextRequest, NextResponse } from 'next/server';
import { ContentProviderService } from '@/lib/integration/content-providers/content-provider-service';

/**
 * Content Provider Webhook Endpoint
 * 
 * This endpoint handles webhook events from content providers.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string; providerId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const providerId = params.providerId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.eventType || !body.payload) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Handle webhook event
    const contentProviderService = ContentProviderService.getInstance();
    const success = await contentProviderService.handleWebhookEvent(
      tenantId,
      providerId,
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
