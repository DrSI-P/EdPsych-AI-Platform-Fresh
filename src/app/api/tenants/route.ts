import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TenantType, SubscriptionTier } from '@/lib/multi-tenant';

// Validation schemas
const createTenantSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.nativeEnum(TenantType),
  adminEmail: z.string().email(),
  adminName: z.string().min(2).max(100),
  subscriptionTier: z.nativeEnum(SubscriptionTier),
  initialDomain: z.string().optional(),
});

/**
 * GET /api/tenants
 * List all tenants with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') as TenantType | null;
    const subscriptionTier = searchParams.get('subscriptionTier') as SubscriptionTier | null;
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // In a real implementation, this would query a database
    // For now, we'll return mock data
    const mockTenants = [
      {
        id: 'tenant-1',
        name: 'Example School',
        type: TenantType.SCHOOL,
        subscriptionTier: SubscriptionTier.STANDARD,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-05-01T00:00:00Z',
        domains: ['example-school.edpsychconnect.com'],
        features: {
          advancedAnalytics: true,
          collaborativeLearning: true,
          parentPortal: true,
          aiTutoring: true,
          customCurriculum: false
        },
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          accentColor: '#FBBF24',
          logoUrl: '/assets/tenants/tenant-1/logo.png',
          faviconUrl: '/assets/tenants/tenant-1/favicon.ico'
        },
        settings: {
          defaultLanguage: 'en-GB',
          timeZone: 'Europe/London',
          academicYear: '2025-2026'
        }
      },
      {
        id: 'tenant-2',
        name: 'Example District',
        type: TenantType.DISTRICT,
        subscriptionTier: SubscriptionTier.PREMIUM,
        createdAt: '2025-02-01T00:00:00Z',
        updatedAt: '2025-05-15T00:00:00Z',
        domains: ['example-district.edpsychconnect.com'],
        features: {
          advancedAnalytics: true,
          collaborativeLearning: true,
          parentPortal: true,
          aiTutoring: true,
          customCurriculum: true
        },
        branding: {
          primaryColor: '#10B981',
          secondaryColor: '#065F46',
          accentColor: '#FBBF24',
          logoUrl: '/assets/tenants/tenant-2/logo.png',
          faviconUrl: '/assets/tenants/tenant-2/favicon.ico'
        },
        settings: {
          defaultLanguage: 'en-GB',
          timeZone: 'Europe/London',
          academicYear: '2025-2026'
        }
      }
    ];

    // Filter by search term
    let filteredTenants = mockTenants;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTenants = filteredTenants.filter(tenant => 
        tenant.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by type
    if (type) {
      filteredTenants = filteredTenants.filter(tenant => tenant.type === type);
    }

    // Filter by subscription tier
    if (subscriptionTier) {
      filteredTenants = filteredTenants.filter(tenant => 
        tenant.subscriptionTier === subscriptionTier
      );
    }

    // Sort tenants
    filteredTenants.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTenants = filteredTenants.slice(startIndex, endIndex);

    // Return response
    return NextResponse.json({
      tenants: paginatedTenants,
      total: filteredTenants.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTenants.length / limit)
    });
  } catch (error) {
    console.error('Error listing tenants:', error);
    return NextResponse.json(
      { message: 'Failed to list tenants' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tenants
 * Create a new tenant
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    const validatedData = createTenantSchema.parse(body);
    
    // In a real implementation, this would create a tenant in the database
    // For now, we'll return mock data
    const newTenant = {
      id: `tenant-${Date.now()}`,
      name: validatedData.name,
      type: validatedData.type,
      subscriptionTier: validatedData.subscriptionTier,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      domains: validatedData.initialDomain ? [validatedData.initialDomain] : [],
      features: {
        advancedAnalytics: validatedData.subscriptionTier !== SubscriptionTier.FREE,
        collaborativeLearning: validatedData.subscriptionTier !== SubscriptionTier.FREE,
        parentPortal: true,
        aiTutoring: validatedData.subscriptionTier === SubscriptionTier.PREMIUM || 
                   validatedData.subscriptionTier === SubscriptionTier.ENTERPRISE,
        customCurriculum: validatedData.subscriptionTier === SubscriptionTier.ENTERPRISE
      },
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#FBBF24',
        logoUrl: `/assets/tenants/${newTenant.id}/logo.png`,
        faviconUrl: `/assets/tenants/${newTenant.id}/favicon.ico`
      },
      settings: {
        defaultLanguage: 'en-GB',
        timeZone: 'Europe/London',
        academicYear: '2025-2026'
      }
    };
    
    // Return response
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    console.error('Error creating tenant:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}
