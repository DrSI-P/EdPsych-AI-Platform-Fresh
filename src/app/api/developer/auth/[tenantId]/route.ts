import { NextRequest, NextResponse } from 'next/server';
import { ApiAuthService } from '@/lib/integration/developer-api/auth-service';

/**
 * API Authentication Endpoint
 * 
 * This endpoint authenticates API credentials and returns a JWT token.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.apiKey || !body.apiSecret) {
      return NextResponse.json(
        { error: { code: 'missing_parameters', message: 'Missing required parameters' } },
        { status: 400 }
      );
    }
    
    // Authenticate API credentials
    const authService = ApiAuthService.getInstance();
    const token = await authService.authenticate(
      body.apiKey,
      body.apiSecret,
      tenantId
    );
    
    // Calculate expiration time (1 hour from now)
    const expiresAt = new Date(Date.now() + 3600000).toISOString();
    
    return NextResponse.json({
      token,
      expiresAt
    });
  } catch (error) {
    console.error('API authentication error:', error);
    
    return NextResponse.json(
      { error: { code: 'authentication_failed', message: 'Authentication failed' } },
      { status: 401 }
    );
  }
}
