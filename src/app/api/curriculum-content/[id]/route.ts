import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { ContentPermission, ContentStatus } from '@/lib/curriculum-content/types';
import { checkUserContentPermission } from '@/lib/curriculum-content/api';

/**
 * GET /api/curriculum-content/[id]
 * Get curriculum content by ID
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

    // Get content with variants
    const content = await db.curriculumContent.findUnique({
      where: { id: contentId },
      include: {
        variants: true,
        feedback: true,
        analytics: true
      }
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching curriculum content:', error);
    return NextResponse.json({ error: 'Failed to fetch curriculum content' }, { status: 500 });
  }
}

/**
 * PUT /api/curriculum-content/[id]
 * Update curriculum content
 */
export async function PUT(
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

    // Get existing content
    const existingContent = await db.curriculumContent.findUnique({
      where: { id: contentId },
      include: { variants: true }
    });

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const data = await request.json();
    
    // Update metadata
    const now = new Date().toISOString();
    const updatedMetadata = {
      ...existingContent.metadata,
      ...data.metadata,
      updatedAt: now,
      updatedBy: userId,
      version: (existingContent.metadata.version || 0) + 1
    };

    // Update content in database
    const updatedContent = await db.curriculumContent.update({
      where: { id: contentId },
      data: {
        metadata: updatedMetadata,
        defaultVariantId: data.defaultVariant?.id || existingContent.defaultVariantId
      },
      include: { variants: true }
    });

    // Handle variants updates
    if (data.variants && data.variants.length > 0) {
      // Process each variant
      for (const variant of data.variants) {
        if (variant.id) {
          // Update existing variant
          await db.contentVariant.update({
            where: { id: variant.id },
            data: {
              ...variant,
              updatedAt: now,
              updatedBy: userId,
              version: (variant.version || 0) + 1
            }
          });
        } else {
          // Create new variant
          await db.contentVariant.create({
            data: {
              ...variant,
              contentId,
              createdAt: now,
              updatedAt: now,
              createdBy: userId,
              updatedBy: userId,
              version: 1
            }
          });
        }
      }
    }

    // Create change history record
    await db.contentChangeRecord.create({
      data: {
        contentId,
        userId,
        timestamp: now,
        previousVersion: existingContent.metadata.version || 0,
        newVersion: updatedMetadata.version,
        changeDescription: data.changeDescription || 'Content updated',
        changeType: 'update'
      }
    });

    // Get updated content with all relations
    const finalContent = await db.curriculumContent.findUnique({
      where: { id: contentId },
      include: {
        variants: true,
        feedback: true,
        analytics: true
      }
    });

    return NextResponse.json(finalContent);
  } catch (error) {
    console.error('Error updating curriculum content:', error);
    return NextResponse.json({ error: 'Failed to update curriculum content' }, { status: 500 });
  }
}

/**
 * DELETE /api/curriculum-content/[id]
 * Delete curriculum content
 */
export async function DELETE(
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
    
    // Check if user has permission to delete this content
    const hasPermission = await checkUserContentPermission(
      userId,
      contentId,
      ContentPermission.ADMIN
    );
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Get existing content
    const existingContent = await db.curriculumContent.findUnique({
      where: { id: contentId }
    });

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Archive instead of hard delete
    const now = new Date().toISOString();
    await db.curriculumContent.update({
      where: { id: contentId },
      data: {
        metadata: {
          ...existingContent.metadata,
          status: ContentStatus.ARCHIVED,
          updatedAt: now,
          updatedBy: userId
        }
      }
    });

    // Create change history record
    await db.contentChangeRecord.create({
      data: {
        contentId,
        userId,
        timestamp: now,
        previousVersion: existingContent.metadata.version || 0,
        newVersion: existingContent.metadata.version || 0,
        changeDescription: 'Content archived',
        changeType: 'delete'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting curriculum content:', error);
    return NextResponse.json({ error: 'Failed to delete curriculum content' }, { status: 500 });
  }
}
