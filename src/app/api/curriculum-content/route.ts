import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { 
  ContentMetadata, 
  CurriculumContent, 
  ContentStatus,
  ContentPermission
} from '@/lib/curriculum-content/types';
import { checkUserContentPermission } from '@/lib/curriculum-content/api';

/**
 * GET /api/curriculum-content
 * Get all curriculum content (with pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyStage = searchParams.get('keyStage');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');

    // Build query
    let query: any = {};
    if (keyStage) query.keyStage = keyStage;
    if (subject) query.subject = subject;
    if (status) query.status = status;

    // Get total count
    const totalCount = await db.curriculumContent.count({ where: query });

    // Get paginated results
    const contents = await db.curriculumContent.findMany({
      where: query,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
      include: {
        variants: true
      }
    });

    return NextResponse.json({
      totalResults: totalCount,
      page,
      pageSize,
      results: contents
    });
  } catch (error) {
    console.error('Error fetching curriculum content:', error);
    return NextResponse.json({ error: 'Failed to fetch curriculum content' }, { status: 500 });
  }
}

/**
 * POST /api/curriculum-content
 * Create new curriculum content
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const hasPermission = await checkUserContentPermission(userId, '', ContentPermission.EDIT);
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.metadata?.title || !data.metadata?.description || !data.metadata?.keyStage || !data.metadata?.subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure at least one variant exists
    if (!data.variants || data.variants.length === 0) {
      return NextResponse.json({ error: 'At least one content variant is required' }, { status: 400 });
    }

    // Add creation metadata
    const now = new Date().toISOString();
    const metadata: ContentMetadata = {
      ...data.metadata,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
      version: 1,
      status: data.metadata.status || ContentStatus.DRAFT
    };

    // Create content in database
    const content = await db.curriculumContent.create({
      data: {
        metadata,
        variants: {
          create: data.variants.map((variant: any) => ({
            ...variant,
            createdAt: now,
            updatedAt: now,
            createdBy: userId,
            updatedBy: userId,
            version: 1
          }))
        },
        defaultVariantId: data.defaultVariant?.id
      },
      include: {
        variants: true
      }
    });

    // Create change history record
    await db.contentChangeRecord.create({
      data: {
        contentId: content.id,
        userId,
        timestamp: now,
        previousVersion: 0,
        newVersion: 1,
        changeDescription: 'Initial creation',
        changeType: 'create'
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error creating curriculum content:', error);
    return NextResponse.json({ error: 'Failed to create curriculum content' }, { status: 500 });
  }
}
