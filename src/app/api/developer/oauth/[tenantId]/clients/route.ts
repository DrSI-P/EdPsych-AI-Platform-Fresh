import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/integration/developer-api/oauth-service';
import { ApiAuthService } from '@/lib/integration/developer-api/auth-service';

/**
 * OAuth 2.0 Client Management Endpoint
 * 
 * This endpoint handles OAuth client registration, listing, and management.
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
    
    // List OAuth clients
    const oauthService = OAuthService.getInstance();
    const clients = await oauthService.listClients(tenantId);
    
    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error listing OAuth clients:', error);
    
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
    
    let userId = '';
    
    try {
      const payload = authService.verifyToken(token);
      
      // Ensure tenant ID matches
      if (payload.tenantId !== tenantId) {
        return NextResponse.json(
          { error: { code: 'forbidden', message: 'Forbidden' } },
          { status: 403 }
        );
      }
      
      userId = payload.keyId;
    } catch (error) {
      return NextResponse.json(
        { error: { code: 'invalid_token', message: 'Invalid token' } },
        { status: 401 }
      );
    }
    
    // Validate required parameters
    if (!body.name || !body.redirectUris || !Array.isArray(body.redirectUris) || body.redirectUris.length === 0) {
      return NextResponse.json(
        { error: { code: 'missing_parameters', message: 'Missing required parameters' } },
        { status: 400 }
      );
    }
    
    // Register OAuth client
    const oauthService = OAuthService.getInstance();
    const client = await oauthService.registerClient(
      tenantId,
      body.name,
      body.description || '',
      body.redirectUris,
      body.allowedScopes || [],
      userId
    );
    
    return NextResponse.json({ client });
  } catch (error) {
    console.error('Error registering OAuth client:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
