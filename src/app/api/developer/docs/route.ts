import { NextRequest, NextResponse } from 'next/server';
import { OpenApiGenerator } from '@/lib/integration/developer-api/openapi-generator';
import { ApiVersion } from '@/lib/integration/developer-api/api-version-service';

/**
 * API Documentation Endpoint
 * 
 * This endpoint serves the OpenAPI documentation for the external developer API.
 */
export async function GET(req: NextRequest) {
  try {
    // Get version from query parameter, default to v1
    const searchParams = req.nextUrl.searchParams;
    const version = searchParams.get('version') || 'v1';
    
    // Validate version
    if (!Object.values(ApiVersion).includes(version as ApiVersion)) {
      return NextResponse.json(
        { error: { code: 'invalid_version', message: 'Invalid API version' } },
        { status: 400 }
      );
    }
    
    // Generate OpenAPI spec
    const generator = OpenApiGenerator.getInstance();
    const spec = generator.generateOpenApiSpec(version as ApiVersion);
    
    // Set content type to application/json
    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error generating API documentation:', error);
    
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
