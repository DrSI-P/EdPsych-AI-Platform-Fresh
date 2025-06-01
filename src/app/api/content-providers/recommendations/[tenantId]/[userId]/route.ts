import { NextRequest, NextResponse } from 'next/server';
import { ContentProviderService } from '@/lib/integration/content-providers/content-provider-service';

/**
 * Content Recommendations Endpoint
 * 
 * This endpoint generates content recommendations for a user.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; userId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const userId = params.userId;
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const contextId = searchParams.get('contextId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    // Generate recommendations
    const contentProviderService = ContentProviderService.getInstance();
    const recommendations = await contentProviderService.generateContentRecommendations(
      tenantId,
      userId,
      contextId,
      limit
    );
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error generating content recommendations:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate content recommendations' },
      { status: 500 }
    );
  }
}
