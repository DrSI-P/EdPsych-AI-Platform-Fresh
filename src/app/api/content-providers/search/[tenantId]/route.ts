import { NextRequest, NextResponse } from 'next/server';
import { ContentProviderService } from '@/lib/integration/content-providers/content-provider-service';

/**
 * Content Search Endpoint
 * 
 * This endpoint searches for content across all registered content providers.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Search for content
    const contentProviderService = ContentProviderService.getInstance();
    const searchResults = await contentProviderService.searchContent(
      tenantId,
      body
    );
    
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Error searching content:', error);
    
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}
