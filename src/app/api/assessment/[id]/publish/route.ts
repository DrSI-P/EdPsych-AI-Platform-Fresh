import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// PUT handler for publishing an assessment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const assessmentId = params.id;
    
    // Fetch the assessment to check ownership and questions
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: true,
      },
    });
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
       // Check if user has permission to publish this assessment
    const isCreator = assessment.creatorId === session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    
    if (!isCreator && !isAdmin && !isTeacher && !isProfessional) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Check if assessment has questions
    if (assessment.questions.length === 0) {
      return NextResponse.json(
        { error: 'Cannot publish an assessment with no questions' },
        { status: 400 }
      );
    }
    
    // Update the assessment status to published
    const publishedAssessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: 'published',
      },
    });
    
    return NextResponse.json(publishedAssessment);
    
  } catch (error) {
    console.error('Error publishing assessment:', error);
    return NextResponse.json(
      { error: 'An error occurred while publishing the assessment' },
      { status: 500 }
    );
  }
}
