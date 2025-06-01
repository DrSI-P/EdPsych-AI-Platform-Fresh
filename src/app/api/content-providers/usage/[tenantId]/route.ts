import { NextRequest, NextResponse } from 'next/server';
import { ContentProviderService } from '@/lib/integration/content-providers/content-provider-service';

/**
 * Content Usage Recording Endpoint
 * 
 * This endpoint records usage data for a content item.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.contentItemId || !body.userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Record content usage
    const contentProviderService = ContentProviderService.getInstance();
    const usageId = await contentProviderService.recordContentUsage(
      tenantId,
      body
    );
    
    return NextResponse.json({ usageId });
  } catch (error) {
    console.error('Error recording content usage:', error);
    
    return NextResponse.json(
      { error: 'Failed to record content usage' },
      { status: 500 }
    );
  }
}
