import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for creating assessment
const createAssessmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().min(1, 'Assessment type is required'),
  subject: z.string().min(1, 'Subject is required'),
  keyStage: z.string().min(1, 'Key stage is required'),
  timeLimit: z.number().int().min(0, 'Time limit must be a positive number or zero'),
  passingScore: z.number().int().min(0, 'Passing score must be a positive number').max(100, 'Passing score cannot exceed 100%'),
  showResults: z.boolean(),
  randomizeQuestions: z.boolean(),
  allowRetakes: z.boolean(),
});

// POST handler for creating a new assessment
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only teachers, professionals, and admins can create assessments
    const allowedRoles = ['teacher', 'professional', 'admin'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const parsed = createAssessmentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const {
      title,
      description,
      type,
      subject,
      keyStage,
      timeLimit,
      passingScore,
      showResults,
      randomizeQuestions,
      allowRetakes,
    } = parsed.data;
    
    // Create new assessment
    const assessment = await prisma.assessment.create({
      data: {
        title,
        description,
        type,
        subject,
        keyStage,
        timeLimit,
        passingScore,
        showResults,
        randomizeQuestions,
        allowRetakes,
        status: 'draft' as 'draft' | 'published' | 'archived',
        creator: {
          connect: { id: session.user.id },
        },
      },
    });
    
    return NextResponse.json(assessment, { status: 201 });
    
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the assessment' },
      { status: 500 }
    );
  }
}

// GET handler for fetching assessments with pagination, filtering, and search
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const type = searchParams.get('type');
    const subject = searchParams.get('subject');
    const keyStage = searchParams.get('keyStage');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Build filter conditions
    const where = {};
    
    // For non-admin users, only show their own assessments or published ones
    if (session.user.role !== 'admin') {
      where.OR = [
        { creatorId: session.user.id },
        { status: 'published' },
      ];
    }
    
    if (type) {
      where.type = type;
    }
    
    if (subject) {
      where.subject = subject;
    }
    
    if (keyStage) {
      where.keyStage = keyStage;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Count total assessments matching the filter
    const total = await prisma.assessment.count({ where });
    
    // Fetch assessments with pagination
    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return NextResponse.json({
      assessments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
    
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching assessments' },
      { status: 500 }
    );
  }
}
