import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { pluginRegistry } from '@/lib/plugins/registry';

/**
 * Google Drive OAuth2 callback handler
 * 
 * This endpoint handles the OAuth2 callback from Google Drive after the user
 * has authorized the application to access their Google Drive.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    // Check if user has admin privileges
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.redirect(
        new URL('/dashboard?error=unauthorized', request.url)
      );
    }
    
    // Get the authorization code from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    // Handle error case
    if (error) {
      console.error('Google Drive OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/admin/plugins?error=${encodeURIComponent(error)}`, request.url)
      );
    }
    
    // Handle missing code
    if (!code) {
      return NextResponse.redirect(
        new URL('/admin/plugins?error=missing_code', request.url)
      );
    }
    
    // Get the Google Drive plugin
    const googleDrivePlugin = pluginRegistry.getPlugin('google-drive-integration');
    
    if (!googleDrivePlugin) {
      return NextResponse.redirect(
        new URL('/admin/plugins?error=plugin_not_found', request.url)
      );
    }
    
    // Exchange the authorization code for tokens
    // This is a simplified version - in a real implementation, we would use the plugin's methods
    const exchangeResult = await exchangeAuthorizationCode(code);
    
    if (!exchangeResult.success) {
      return NextResponse.redirect(
        new URL(`/admin/plugins?error=${encodeURIComponent(exchangeResult.error || 'token_exchange_failed')}`, request.url)
      );
    }
    
    // Store the tokens in the database
    await prisma.pluginCredential.upsert({
      where: {
        pluginId_userId: {
          pluginId: 'google-drive-integration',
          userId: session.user.id,
        },
      },
      update: {
        credentials: {
          accessToken: exchangeResult.accessToken,
          refreshToken: exchangeResult.refreshToken,
          expiresAt: exchangeResult.expiresAt,
        },
        updatedAt: new Date(),
      },
      create: {
        pluginId: 'google-drive-integration',
        userId: session.user.id,
        credentials: {
          accessToken: exchangeResult.accessToken,
          refreshToken: exchangeResult.refreshToken,
          expiresAt: exchangeResult.expiresAt,
        },
      },
    });
    
    // Redirect to the plugins page with success message
    return NextResponse.redirect(
      new URL('/admin/plugins?success=google_drive_connected', request.url)
    );
  } catch (error) {
    console.error('Error handling Google Drive OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/admin/plugins?error=server_error', request.url)
    );
  }
}

/**
 * Exchange authorization code for tokens
 * 
 * This function exchanges the authorization code for access and refresh tokens.
 */
async function exchangeAuthorizationCode(code: string) {
  try {
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_APP_URL + '/api/plugins/google-drive/oauth-callback';
    
    if (!clientId || !clientSecret) {
      return {
        success: false,
        error: 'missing_credentials',
      };
    }
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'token_exchange_failed',
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Failed to exchange authorization code:', error);
    return {
      success: false,
      error: 'token_exchange_failed',
    };
  }
}
