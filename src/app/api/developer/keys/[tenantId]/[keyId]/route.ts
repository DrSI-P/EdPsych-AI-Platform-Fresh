import { NextRequest, NextResponse } from 'next/server';
import { ApiAuthService } from '@/lib/integration/developer-api/auth-service';
import { ApiRateLimitService } from '@/lib/integration/developer-api/rate-limit-service';

/**
 * API Key Revocation Endpoint
 * 
 * This endpoint revokes an API key.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { tenantId: string; keyId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const keyId = params.keyId;
    
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Unauthorized' } },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const authService = ApiAuthService.getInstance();
    
    try {
      const payload = authService.verifyToken(token);
      
      // Ensure tenant ID matches
      if (payload.tenantId !== tenantId) {
        return NextResponse.json(
          { error: { code: 'forbidden', message: 'Forbidden' } },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: { code: 'invalid_token', message: 'Invalid token' } },
        { status: 401 }
      );
    }
    
    // Revoke API key
    const success = await authService.revokeApiKey(keyId, tenantId);
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error revoking API key:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
