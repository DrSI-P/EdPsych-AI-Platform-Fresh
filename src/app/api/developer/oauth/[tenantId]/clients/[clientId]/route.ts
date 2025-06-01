import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/integration/developer-api/oauth-service';
import { ApiAuthService } from '@/lib/integration/developer-api/auth-service';

/**
 * OAuth 2.0 Client Management Endpoint for specific client
 * 
 * This endpoint handles updating and deleting specific OAuth clients.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; clientId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const clientId = params.clientId;
    
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
    
    // Get OAuth client
    const oauthService = OAuthService.getInstance();
    const client = await oauthService.findClientByClientId(clientId, tenantId);
    
    if (!client) {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Client not found' } },
        { status: 404 }
      );
    }
    
    // Remove client secret from response
    const { clientSecret, ...clientWithoutSecret } = client;
    
    return NextResponse.json({ client: clientWithoutSecret });
  } catch (error) {
    console.error('Error getting OAuth client:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { tenantId: string; clientId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const clientId = params.clientId;
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
    
    // Update OAuth client
    const oauthService = OAuthService.getInstance();
    const client = await oauthService.updateClient(
      clientId,
      tenantId,
      body
    );
    
    return NextResponse.json({ client });
  } catch (error) {
    console.error('Error updating OAuth client:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tenantId: string; clientId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const clientId = params.clientId;
    
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
    
    // Delete OAuth client
    const oauthService = OAuthService.getInstance();
    await oauthService.deleteClient(clientId, tenantId);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting OAuth client:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
