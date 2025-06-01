import { NextRequest, NextResponse } from 'next/server';
import { ContentProviderService } from '@/lib/integration/content-providers/content-provider-service';

/**
 * Content Provider Registration Endpoint
 * 
 * This endpoint registers a new content provider for a tenant.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.name || !body.type || !body.baseUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Register content provider
    const contentProviderService = ContentProviderService.getInstance();
    const providerId = await contentProviderService.registerContentProvider(
      tenantId,
      body
    );
    
    return NextResponse.json({ providerId });
  } catch (error) {
    console.error('Error registering content provider:', error);
    
    return NextResponse.json(
      { error: 'Failed to register content provider' },
      { status: 500 }
    );
  }
}
