import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// GET handler for fetching pupil voice surveys
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Build the query
    const query = {
      creatorId: session.user.id,
    };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Fetch pupil voice surveys
    const surveys = await prisma.pupilVoiceSurvey.findMany({
      where: query,
      orderBy: [
        { createdAt: 'desc' },
      ],
      include: {
        questions: true,
        responses: {
          select: {
            id: true,
          },
        },
      },
    });
    
    // Transform the data to include question and response counts
    const transformedSurveys = surveys.map(survey => ({
      id: survey.id,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      createdAt: survey.createdAt,
      updatedAt: survey.createdAt,
      questionCount: survey.questions.length,
      responseCount: survey.responses.length,
    }));
    
    return NextResponse.json(transformedSurveys);
    
  } catch (error) {
    console.error('Error fetching pupil voice surveys:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching pupil voice surveys' },
      { status: 500 }
    );
  }
}
  // POST handler for creating a new pupil voice survey
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    const { title, description, questions, templateId } = body;
    
    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    // Create the pupil voice survey
    const survey = await prisma.pupilVoiceSurvey.create({
      data: {
        title,
        description: description || '',
        status: 'draft',
        createdBy: {
          connect: {
            id: session.user.id,
          },
        },
        questions: {
          create: questions?.map((question) => ({
            text: question.text,
            type: question.type,
            required: question.required || false,
            options: question.options || [],
            order: question.order || 0,
          })) || [],
        },
        templateId: templateId || null,
      },
      include: {
        questions: true,
      },
    });
    
    return NextResponse.json(survey);
    
  } catch (error) {
    console.error('Error creating pupil voice survey:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the pupil voice survey' },
      { status: 500 }
    );
  }
}
