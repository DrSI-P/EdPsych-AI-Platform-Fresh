import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/prisma';

// Define interface for where clause to replace any type
interface PlanWhereClause {
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
  subject?: string;
  keyStage?: string;
  status?: string;
  userId?: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const subject = searchParams.get('subject') || undefined;
    const keyStage = searchParams.get('keyStage') || undefined;
    const status = searchParams.get('status') || undefined;
    const userId = searchParams.get('userId') || undefined;

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: PlanWhereClause = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
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

    if (userId) {
      where.userId = userId;
    }

    // Get curriculum plans with pagination
    const plans = await prisma.curriculumPlan.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        objectives: {
          select: {
            id: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Transform data to include counts
    const transformedPlans = plans.map(plan => ({
      ...plan,
      objectivesCount: plan.objectives.length,
      resourcesCount: 0, // Set to 0 since resources relation doesn't exist
      assessmentsCount: 0, // Set to 0 since assessments relation doesn't exist
      collaboratorsCount: plan.collaborators.length,
      objectives: undefined,
      collaborators: plan.collaborators.map(c => c.user),
    }));

    // Get total count for pagination
    const totalPlans = await prisma.curriculumPlan.count({ where });
    const totalPages = Math.ceil(totalPlans / limit);

    return NextResponse.json({
      plans: transformedPlans,
      pagination: {
        page,
        limit,
        totalPlans,
        totalPages,
      },
    });
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error fetching curriculum plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch curriculum plans' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to create a curriculum plan' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    const { title, subject, keyStage, year } = body;
    
    if (!title || !subject || !keyStage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new curriculum plan
    const plan = await prisma.curriculumPlan.create({
      data: {
        title,
        subject,
        keyStage,
        year: year || '',
        user: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error creating curriculum plan:', error);
    return NextResponse.json(
      { error: 'Failed to create curriculum plan' },
      { status: 500 }
    );
  }
}
