import { NextRequest, NextResponse } from 'next/server';
import { OneRosterService } from '@/lib/integration/sis/oneroster-service';

/**
 * SIS CSV Upload Endpoint
 * 
 * This endpoint handles the upload of CSV files for OneRoster synchronization.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string; integrationId: string } }
) {
  try {
    const tenantId = params.tenantId;
    const integrationId = params.integrationId;
    
    // Parse the multipart form data
    const formData = await req.formData();
    const files = [];
    
    // Process each file in the form data
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Extract entity type from the key (e.g., "users", "classes")
        const entityType = key.split('-')[0];
        
        // Validate entity type
        if (!['orgs', 'academicSessions', 'courses', 'classes', 'users', 'enrollments'].includes(entityType)) {
          return NextResponse.json(
            { error: `Invalid entity type: ${entityType}` },
            { status: 400 }
          );
        }
        
        // Read file content
        const buffer = Buffer.from(await value.arrayBuffer());
        
        files.push({
          filename: value.name,
          content: buffer,
          entityType
        });
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }
    
    // Upload the CSV files
    const oneRosterService = OneRosterService.getInstance();
    const uploadId = await oneRosterService.uploadCsvFiles(
      integrationId,
      tenantId,
      files
    );
    
    return NextResponse.json({ uploadId });
  } catch (error) {
    console.error('Error uploading CSV files:', error);
    
    return NextResponse.json(
      { error: 'Failed to upload CSV files' },
      { status: 500 }
    );
  }
}
