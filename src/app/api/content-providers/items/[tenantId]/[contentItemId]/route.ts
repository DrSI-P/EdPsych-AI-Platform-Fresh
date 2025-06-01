import { NextRequest, NextResponse } from 'next/server';
import { ContentProviderService } from '@/lib/integration/content-providers/content-provider-service';

/**
 * Content Item Details Endpoint
 * 
 * This endpoint retrieves details for a specific content item.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; contentItemId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const contentItemId = params.contentItemId;
    
    // Get content item details
    const contentProviderService = ContentProviderService.getInstance();
    const contentItem = await contentProviderService.getContentItem(
      tenantId,
      contentItemId
    );
    
    return NextResponse.json(contentItem);
  } catch (error) {
    console.error('Error getting content item:', error);
    
    return NextResponse.json(
      { error: 'Failed to get content item' },
      { status: 500 }
    );
  }
}
