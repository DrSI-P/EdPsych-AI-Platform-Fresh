import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get social skills goals for the user
    const goals = await db.prisma.socialSkillsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Error fetching social skills goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.skillArea || !data.measurableOutcome || !data.strategies) {
      return NextResponse.json({ 
        error: 'Title, skill area, measurable outcome, and strategies are required' 
      }, { status: 400 });
    }
    
    // Create new goal
    const goal = await db.prisma.socialSkillsGoal.create({
      data: {
        userId,
        title: data.title,
        description: data.description || '',
        skillArea: data.skillArea,
        measurableOutcome: data.measurableOutcome,
        strategies: data.strategies,
        progress: 0,
        startDate: data.startDate || new Date(),
        targetDate: data.targetDate || null,
        completedDate: null,
      },
    });
    
    // Log the goal creation
    await db.prisma.socialSkillsLog.create({
      data: {
        userId,
        action: 'goal_created',
        details: { goalId: goal.id },
      },
    });
    
    return NextResponse.json({ 
      message: 'Goal created successfully',
      goal 
    });
  } catch (error) {
    console.error('Error creating social skills goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
