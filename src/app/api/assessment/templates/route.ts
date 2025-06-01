import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// GET handler for fetching assessment templates
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const keyStage = searchParams.get('keyStage');
    const isPublic = searchParams.get('isPublic');
    const createdBy = searchParams.get('createdBy');
    
    // Build the query
    const query = {};
    
    if (subject) {
      query.subject = subject;
    }
    
    if (keyStage) {
      query.keyStage = keyStage;
    }
    
    if (isPublic === 'true') {
      query.isPublic = true;
    }
    
    if (createdBy) {
      query.creatorId = createdBy;
    }
    
    // Fetch templates
    const templates = await prisma.assessmentTemplate.findMany({
      where: {
        ...query,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(templates);
    
  } catch (error) {
    console.error('Error fetching assessment templates:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the assessment templates' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new assessment template
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has permission to create templates (admin, teacher, professional)
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    
    if (!isAdmin && !isTeacher && !isProfessional) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse request body
    const body = await request.json();
    const { title, description, subject, keyStage, type, isPublic, tags, assessment } = body;
    
    // Validate required fields
    if (!title || !subject || !keyStage || !assessment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create the template
    const template = await prisma.assessmentTemplate.create({
      data: {
        title,
        description: description || '',
        subject,
        keyStage,
        type: type || 'quiz',
        isPublic: isPublic || false,
        tags: tags || [],
        questionCount: assessment.questions?.length || 0,
        templateData: assessment,
        createdBy: {
          connect: { id: session.user.id },
        },
      },
    });
    
    return NextResponse.json(template);
    
  } catch (error) {
    console.error('Error creating assessment template:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the assessment template' },
      { status: 500 }
    );
  }
}
