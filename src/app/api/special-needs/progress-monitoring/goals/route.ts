import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for managing progress monitoring goals
 * 
 * This endpoint handles creating, retrieving, and managing goals for progress monitoring.
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's progress monitoring goals
    const goals = await prisma.monitoringGoal.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      goals: goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetDate: goal.targetDate,
        baseline: goal.baseline,
        target: goal.target,
        currentValue: goal.currentValue,
        unit: goal.unit,
        notes: goal.notes
      }))
    });
  } catch (error) {
    console.error('Progress monitoring goals API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve progress monitoring goals' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { goal } = body;

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal object is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!goal.title || !goal.targetDate || goal.baseline === undefined || goal.target === undefined || !goal.unit) {
      return NextResponse.json(
        { error: 'Missing required goal fields' },
        { status: 400 }
      );
    }

    // Create goal in database
    const newGoal = await prisma.monitoringGoal.create({
      data: {
        userId: session.user.id,
        title: goal.title,
        description: goal.description || '',
        targetDate: new Date(goal.targetDate),
        baseline: goal.baseline,
        target: goal.target,
        currentValue: goal.baseline,
        unit: goal.unit,
        notes: goal.notes || ''
      }
    });

    // Log the goal creation for analytics
    await prisma.monitoringLog.create({
      data: {
        userId: session.user.id,
        action: 'goal_created',
        details: JSON.stringify({
          goalId: newGoal.id,
          title: newGoal.title
        }),
      }
    });

    return NextResponse.json({
      success: true,
      goal: newGoal
    });
  } catch (error) {
    console.error('Progress monitoring goals API error:', error);
    return NextResponse.json(
      { error: 'Failed to create progress monitoring goal' },
      { status: 500 }
    );
  }
}
