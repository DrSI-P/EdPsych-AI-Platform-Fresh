import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/integration/developer-api/oauth-service';

/**
 * OAuth 2.0 Token Endpoint
 * 
 * This endpoint handles token requests in the OAuth 2.0 flow.
 * It supports authorization_code and refresh_token grant types.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const formData = await req.formData();
    
    // Get required parameters
    const grantType = formData.get('grant_type')?.toString();
    const clientId = formData.get('client_id')?.toString();
    const clientSecret = formData.get('client_secret')?.toString();
    
    // Validate required parameters
    if (!grantType || !clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const oauthService = OAuthService.getInstance();
    
    // Handle different grant types
    if (grantType === 'authorization_code') {
      const code = formData.get('code')?.toString();
      const redirectUri = formData.get('redirect_uri')?.toString();
      
      if (!code || !redirectUri) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'Missing required parameters for authorization_code grant' },
          { status: 400 }
        );
      }
      
      try {
        const accessToken = await oauthService.exchangeAuthorizationCode(
          code,
          clientId,
          clientSecret,
          redirectUri
        );
        
        return NextResponse.json({
          access_token: accessToken.token,
          token_type: 'Bearer',
          expires_in: Math.floor((accessToken.expiresAt.getTime() - Date.now()) / 1000),
          refresh_token: accessToken.refreshToken,
          scope: accessToken.scopes.join(' ')
        });
      } catch (error) {
        console.error('Error exchanging authorization code:', error);
        
        return NextResponse.json(
          { error: 'invalid_grant', error_description: 'Invalid authorization code' },
          { status: 400 }
        );
      }
    } else if (grantType === 'refresh_token') {
      const refreshToken = formData.get('refresh_token')?.toString();
      
      if (!refreshToken) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'Missing refresh_token parameter' },
          { status: 400 }
        );
      }
      
      try {
        const accessToken = await oauthService.refreshAccessToken(
          refreshToken,
          clientId,
          clientSecret
        );
        
        return NextResponse.json({
          access_token: accessToken.token,
          token_type: 'Bearer',
          expires_in: Math.floor((accessToken.expiresAt.getTime() - Date.now()) / 1000),
          refresh_token: accessToken.refreshToken,
          scope: accessToken.scopes.join(' ')
        });
      } catch (error) {
        console.error('Error refreshing access token:', error);
        
        return NextResponse.json(
          { error: 'invalid_grant', error_description: 'Invalid refresh token' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'unsupported_grant_type', error_description: 'Unsupported grant type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('OAuth token error:', error);
    
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}
