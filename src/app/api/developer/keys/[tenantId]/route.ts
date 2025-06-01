import { NextRequest, NextResponse } from 'next/server';
import { ApiAuthService } from '@/lib/integration/developer-api/auth-service';

/**
 * API Key Management Endpoint
 * 
 * This endpoint handles API key creation, listing, and revocation.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    
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
    
    // List API keys
    const keys = await authService.listApiKeys(tenantId);
    
    return NextResponse.json({ keys });
  } catch (error) {
    console.error('Error listing API keys:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
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
    
    // Validate required parameters
    if (!body.name || !body.permissions || !Array.isArray(body.permissions) || body.permissions.length === 0) {
      return NextResponse.json(
        { error: { code: 'missing_parameters', message: 'Missing required parameters' } },
        { status: 400 }
      );
    }
    
    // Generate API key
    const apiKey = await authService.generateApiKey(
      tenantId,
      body.name,
      body.permissions,
      body.createdBy || 'system'
    );
    
    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error('Error generating API key:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
