import { NextRequest, NextResponse } from 'next/server';
import { OneRosterService } from '@/lib/integration/sis/oneroster-service';

/**
 * SIS Integration Registration Endpoint
 * 
 * This endpoint registers a new SIS integration for a tenant.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.sisName || !body.integrationMethod) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Validate integration method
    if (body.integrationMethod !== 'rest' && body.integrationMethod !== 'csv') {
      return NextResponse.json(
        { error: 'Invalid integration method' },
        { status: 400 }
      );
    }
    
    // Validate REST API parameters if using REST
    if (body.integrationMethod === 'rest' && (!body.apiUrl || !body.clientId || !body.clientSecret)) {
      return NextResponse.json(
        { error: 'Missing required REST API parameters' },
        { status: 400 }
      );
    }
    
    // Register SIS integration
    const oneRosterService = OneRosterService.getInstance();
    const integrationId = await oneRosterService.registerSisIntegration(
      tenantId,
      body.sisName,
      body.apiUrl || null,
      body.clientId || null,
      body.clientSecret || null,
      body.integrationMethod
    );
    
    return NextResponse.json({ integrationId });
  } catch (error) {
    console.error('Error registering SIS integration:', error);
    
    return NextResponse.json(
      { error: 'Failed to register SIS integration' },
      { status: 500 }
    );
  }
}
