import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { ContentPermission } from '@/lib/curriculum-content/types';
import { checkUserContentPermission } from '@/lib/curriculum-content/api';

/**
 * GET /api/curriculum-content/[id]/variants
 * Get all variants for a curriculum content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentId = params.id;
    
    // Check if user has permission to view this content
    const hasPermission = await checkUserContentPermission(
      session.user.id,
      contentId,
      ContentPermission.VIEW
    );
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Get variants
    const variants = await db.contentVariant.findMany({
      where: { contentId }
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error fetching content variants:', error);
    return NextResponse.json({ error: 'Failed to fetch content variants' }, { status: 500 });
  }
}

/**
 * POST /api/curriculum-content/[id]/variants
 * Create new variant for curriculum content
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentId = params.id;
    const userId = session.user.id;
    
    // Check if user has permission to edit this content
    const hasPermission = await checkUserContentPermission(
      userId,
      contentId,
      ContentPermission.EDIT
    );
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Check if content exists
    const content = await db.curriculumContent.findUnique({
      where: { id: contentId }
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.learningStyle || !data.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create variant
    const now = new Date().toISOString();
    const variant = await db.contentVariant.create({
      data: {
        ...data,
        contentId,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1
      }
    });

    // Update content change history
    await db.contentChangeRecord.create({
      data: {
        contentId,
        userId,
        timestamp: now,
        previousVersion: content.metadata.version || 0,
        newVersion: content.metadata.version || 0,
        changeDescription: `Added ${data.learningStyle} variant`,
        changeType: 'update'
      }
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error creating content variant:', error);
    return NextResponse.json({ error: 'Failed to create content variant' }, { status: 500 });
  }
}
