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

// GET handler for fetching a specific assessment response
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
    
    const responseId = params.id;
    
    // Fetch the response with user and answers
    const response = await prisma.assessmentResponse.findUnique({
      where: { id: responseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: true,
        assessment: true,
      },
    });
    
    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }
    
    // Check if user has access to this response
    const isCreator = response.assessment.creatorId === session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    const isOwner = response.userId === session.user.id;
    
    // Only allow access if user is creator of assessment, admin, teacher, professional, or the student who submitted
    if (!isCreator && !isAdmin && !isTeacher && !isProfessional && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching response:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the response' },
      { status: 500 }
    );
  }
}
