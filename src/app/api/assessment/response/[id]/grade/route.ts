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

interface Grade {
  answerId: string;
  isCorrect: boolean;
  feedback?: string;
}

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
        assessment: {
          select: {
            id: true,
            title: true,
            description: true,
            creatorId: true,
          },
        },
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

// PUT handler for updating grades for a response
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
    
    // Check if user has permission to grade (admin, teacher, professional)
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    
    if (!isAdmin && !isTeacher && !isProfessional) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const responseId = params.id;
    
    // Fetch the response to check if it exists
    const response = await prisma.assessmentResponse.findUnique({
      where: { id: responseId },
      include: {
        assessment: true,
      },
    });
    
    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }
    
    // Parse request body
    const body = await request.json();
    const { grades, totalScore, feedback } = body;
    
    if (!Array.isArray(grades)) {
      return NextResponse.json({ error: 'Invalid grades format' }, { status: 400 });
    }
    
    // Update each answer with the provided grade
    for (const grade of grades as Grade[]) {
      if (!grade.answerId) continue;
      
      await prisma.assessmentAnswer.update({
        where: { id: grade.answerId },
        data: {
          isCorrect: grade.isCorrect,
          feedback: grade.feedback,
        },
      });
    }
    
    // Update the response with the total score and feedback
    const updatedResponse = await prisma.assessmentResponse.update({
      where: { id: responseId },
      data: {
        score: totalScore,
        feedback: feedback || response.feedback,
        gradedBy: { connect: { id: session.user.id } },
        gradedAt: new Date(),
      },
    });
    
    return NextResponse.json(updatedResponse);
    
  } catch (error) {
    console.error('Error updating grades:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the grades' },
      { status: 500 }
    );
  }
}
