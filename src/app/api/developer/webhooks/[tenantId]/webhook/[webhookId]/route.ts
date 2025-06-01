import { NextRequest, NextResponse } from 'next/server';
import { ApiAuthService } from '@/lib/integration/developer-api/auth-service';
import { ApiWebhookService } from '@/lib/integration/developer-api/webhook-service';

/**
 * API Webhook Management Endpoint for specific webhook
 * 
 * This endpoint handles webhook updates and deletion.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { tenantId: string; webhookId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const webhookId = params.webhookId;
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
    
    // Update webhook
    const webhookService = ApiWebhookService.getInstance();
    const webhook = await webhookService.updateWebhook(
      webhookId,
      tenantId,
      body
    );
    
    return NextResponse.json({ webhook });
  } catch (error) {
    console.error('Error updating webhook:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tenantId: string; webhookId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const webhookId = params.webhookId;
    
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
    
    // Delete webhook
    const webhookService = ApiWebhookService.getInstance();
    const success = await webhookService.deleteWebhook(webhookId, tenantId);
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
