import { NextRequest, NextResponse } from 'next/server';
import { ApiAuthService } from '@/lib/integration/developer-api/auth-service';
import { ApiWebhookService } from '@/lib/integration/developer-api/webhook-service';

/**
 * API Webhook Management Endpoint
 * 
 * This endpoint handles webhook registration, listing, and updates.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; apiKeyId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const apiKeyId = params.apiKeyId;
    
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
      
      // Check webhook:manage permission
      if (!authService.hasPermission(payload, 'webhook:manage')) {
        return NextResponse.json(
          { error: { code: 'insufficient_permissions', message: 'Insufficient permissions' } },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: { code: 'invalid_token', message: 'Invalid token' } },
        { status: 401 }
      );
    }
    
    // List webhooks
    const webhookService = ApiWebhookService.getInstance();
    const webhooks = await webhookService.listWebhooks(apiKeyId, tenantId);
    
    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error('Error listing webhooks:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string; apiKeyId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const apiKeyId = params.apiKeyId;
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
      
      // Check webhook:manage permission
      if (!authService.hasPermission(payload, 'webhook:manage')) {
        return NextResponse.json(
          { error: { code: 'insufficient_permissions', message: 'Insufficient permissions' } },
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
    if (!body.url || !body.events || !Array.isArray(body.events) || body.events.length === 0) {
      return NextResponse.json(
        { error: { code: 'missing_parameters', message: 'Missing required parameters' } },
        { status: 400 }
      );
    }
    
    // Register webhook
    const webhookService = ApiWebhookService.getInstance();
    const webhook = await webhookService.registerWebhook(
      tenantId,
      apiKeyId,
      body.url,
      body.events
    );
    
    return NextResponse.json({ webhook });
  } catch (error) {
    console.error('Error registering webhook:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
