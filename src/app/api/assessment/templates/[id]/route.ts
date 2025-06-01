import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// Type for route params
type RouteParams = {
  params: {
    id: string;
  };
};

// GET handler for fetching a specific assessment template
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const templateId = params.id;
    
    // Fetch the template
    const template = await prisma.assessmentTemplate.findUnique({
      where: {
        id: templateId,
        OR: [
          { isPublic: true },
          { creatorId: session.user.id }
        ]
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found or access denied' }, { status: 404 });
    }
    
    return NextResponse.json(template);
    
  } catch (error) {
    console.error('Error fetching assessment template:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the assessment template' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a specific assessment template
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const templateId = params.id;
    
    // Check if the template exists and belongs to the user
    const existingTemplate = await prisma.assessmentTemplate.findUnique({
      where: {
        id: templateId,
      },
    });
    
    if (!existingTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    
    // Check if user has permission to update the template
    const isAdmin = session.user.role === 'admin';
    const isOwner = existingTemplate.creatorId === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse request body
    const body = await request.json();
    const { title, description, isPublic, tags } = body;
    
    // Update the template
    const updatedTemplate = await prisma.assessmentTemplate.update({
      where: {
        id: templateId,
      },
      data: {
        title: title || existingTemplate.title,
        description: description !== undefined ? description : existingTemplate.description,
        isPublic: isPublic !== undefined ? isPublic : existingTemplate.isPublic,
        tags: tags || existingTemplate.tags,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    return NextResponse.json(updatedTemplate);
    
  } catch (error) {
    console.error('Error updating assessment template:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the assessment template' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a specific assessment template
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const templateId = params.id;
    
    // Check if the template exists and belongs to the user
    const existingTemplate = await prisma.assessmentTemplate.findUnique({
      where: {
        id: templateId,
      },
    });
    
    if (!existingTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    
    // Check if user has permission to delete the template
    const isAdmin = session.user.role === 'admin';
    const isOwner = existingTemplate.creatorId === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Delete the template
    await prisma.assessmentTemplate.delete({
      where: {
        id: templateId,
      },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting assessment template:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the assessment template' },
      { status: 500 }
    );
  }
}
