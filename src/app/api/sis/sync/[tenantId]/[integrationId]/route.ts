import { NextRequest, NextResponse } from 'next/server';
import { OneRosterService } from '@/lib/integration/sis/oneroster-service';
import { OneRosterSyncMode, OneRosterEntityType } from '@/lib/integration/sis/types';

/**
 * SIS Synchronization Endpoint
 * 
 * This endpoint initiates a synchronization of roster data from a Student Information System
 * using the OneRoster standard.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string; integrationId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const integrationId = params.integrationId;
    const body = await req.json();
    
    // Validate required parameters
    if (!body.entities || !Array.isArray(body.entities) || body.entities.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid entities parameter' },
        { status: 400 }
      );
    }
    
    // Validate entity types
    const validEntityTypes: OneRosterEntityType[] = ['orgs', 'academicSessions', 'courses', 'classes', 'users', 'enrollments'];
    const entities = body.entities.filter((entity: string) => 
      validEntityTypes.includes(entity as OneRosterEntityType)
    ) as OneRosterEntityType[];
    
    if (entities.length === 0) {
      return NextResponse.json(
        { error: 'No valid entity types specified' },
        { status: 400 }
      );
    }
    
    // Set default values for optional parameters
    const mode: OneRosterSyncMode = body.mode === 'delta' ? 'delta' : 'full';
    const dryRun = body.dryRun === true;
    
    // Initiate synchronization
    const oneRosterService = OneRosterService.getInstance();
    const result = await oneRosterService.synchronizeRoster(
      integrationId,
      tenantId,
      {
        entities,
        mode,
        dryRun
      }
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error synchronizing roster:', error);
    
    return NextResponse.json(
      { error: 'Failed to synchronize roster' },
      { status: 500 }
    );
  }
}
