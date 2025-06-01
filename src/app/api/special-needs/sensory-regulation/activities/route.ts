import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema for validating sensory activity
const sensoryActivitySchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(['calming', 'alerting', 'organising']),
  sensorySystems: z.array(z.enum(['visual', 'auditory', 'tactile', 'vestibular', 'proprioceptive', 'olfactory', 'gustatory'])),
  duration: z.number().min(1).max(60),
  materials: z.string().max(500).optional(),
  instructions: z.string().max(1000),
  evidenceBase: z.string().max(500).optional(),
  isCustom: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const system = searchParams.get('system');
    const includeDefault = searchParams.get('includeDefault') !== 'false';

    // Build query
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (system) {
      query.sensorySystems = {
        has: system
      };
    }
    
    // Fetch activities from database
    const activities = await prisma.sensoryActivity.findMany({
      where: {
        OR: [
          { userId: userId },
          { isCustom: false, ...(includeDefault ? {} : { id: 'none' }) }
        ],
        ...query
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Return activities
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching sensory activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sensory activities' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Parse request body
    const body = await req.json();
    body.userId = userId;

    // Validate request body
    const validatedData = sensoryActivitySchema.parse(body);

    // Create activity in database
    const activity = await prisma.sensoryActivity.create({
      data: {
        userId: userId,
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        sensorySystems: validatedData.sensorySystems,
        duration: validatedData.duration,
        materials: validatedData.materials,
        instructions: validatedData.instructions,
        evidenceBase: validatedData.evidenceBase,
        isCustom: validatedData.isCustom,
      },
    });

    // Log the activity creation
    await prisma.sensoryRegulationLog.create({
      data: {
        userId: userId,
        action: 'create_activity',
        details: JSON.stringify({ activityId: activity.id }),
      },
    });

    // Return created activity
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating sensory activity:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create sensory activity' },
      { status: 500 }
    );
  }
}
