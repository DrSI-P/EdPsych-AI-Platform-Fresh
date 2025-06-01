import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/integration/developer-api/oauth-service';
import { ApiPermission } from '@/lib/integration/developer-api/types';

/**
 * OAuth 2.0 Authorization Endpoint
 * 
 * This endpoint handles the authorization request in the OAuth 2.0 flow.
 * It validates the client and redirects to the consent page.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const searchParams = req.nextUrl.searchParams;
    
    // Get required parameters
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    const responseType = searchParams.get('response_type');
    const scope = searchParams.get('scope');
    const state = searchParams.get('state');
    
    // Validate required parameters
    if (!clientId || !redirectUri || !responseType || !scope) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Validate response type
    if (responseType !== 'code') {
      return NextResponse.json(
        { error: 'unsupported_response_type', error_description: 'Only code response type is supported' },
        { status: 400 }
      );
    }
    
    // Parse scopes
    const scopes = scope.split(' ').map(s => s as ApiPermission);
    
    // Validate client and redirect URI
    const oauthService = OAuthService.getInstance();
    
    try {
      const client = await oauthService.findClientByClientId(clientId, tenantId);
      
      if (!client) {
        return NextResponse.json(
          { error: 'invalid_client', error_description: 'Client not found' },
          { status: 400 }
        );
      }
      
      if (!client.active) {
        return NextResponse.json(
          { error: 'invalid_client', error_description: 'Client is not active' },
          { status: 400 }
        );
      }
      
      if (!client.redirectUris.includes(redirectUri)) {
        return NextResponse.json(
          { error: 'invalid_redirect_uri', error_description: 'Redirect URI not allowed' },
          { status: 400 }
        );
      }
      
      // Validate scopes
      for (const requestedScope of scopes) {
        if (!client.allowedScopes.includes(requestedScope)) {
          return NextResponse.json(
            { error: 'invalid_scope', error_description: `Scope not allowed: ${requestedScope}` },
            { status: 400 }
          );
        }
      }
      
      // Redirect to consent page
      const consentUrl = new URL(`/oauth/consent`, req.nextUrl.origin);
      consentUrl.searchParams.set('client_id', clientId);
      consentUrl.searchParams.set('redirect_uri', redirectUri);
      consentUrl.searchParams.set('scope', scope);
      if (state) {
        consentUrl.searchParams.set('state', state);
      }
      
      return NextResponse.redirect(consentUrl);
    } catch (error) {
      console.error('Error validating client:', error);
      
      return NextResponse.json(
        { error: 'server_error', error_description: 'Error validating client' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('OAuth authorization error:', error);
    
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}
