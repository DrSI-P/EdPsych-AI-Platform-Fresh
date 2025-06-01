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

// GET handler for fetching assessment results
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
    
    const assessmentId = params.id;
    
    // Fetch the assessment with questions
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        responses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            answers: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Check if user has access to this assessment's results
    const isCreator = assessment.creatorId === session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    
    // Only allow access if user is creator, admin, teacher, or professional
    if (!isCreator && !isAdmin && !isTeacher && !isProfessional) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json(assessment);
    
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the assessment results' },
      { status: 500 }
    );
  }
}
