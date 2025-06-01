import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for managing individual goals in progress monitoring
 * 
 * This endpoint handles retrieving, updating, and deleting specific goals.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const goalId = params.goalId;

    // Get the specific goal
    const goal = await prisma.monitoringGoal.findUnique({
      where: {
        id: goalId,
        userId: session.user.id
      }
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      goal: {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetDate: goal.targetDate,
        baseline: goal.baseline,
        target: goal.target,
        currentValue: goal.currentValue,
        unit: goal.unit,
        notes: goal.notes
      }
    });
  } catch (error) {
    console.error('Progress monitoring goal API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve goal' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const goalId = params.goalId;

    // Parse request body
    const body = await req.json();
    const { goal } = body;

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal object is required' },
        { status: 400 }
      );
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.monitoringGoal.findUnique({
      where: {
        id: goalId,
        userId: session.user.id
      }
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Update goal
    const updatedGoal = await prisma.monitoringGoal.update({
      where: {
        id: goalId
      },
      data: {
        title: goal.title || existingGoal.title,
        description: goal.description !== undefined ? goal.description : existingGoal.description,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : existingGoal.targetDate,
        baseline: goal.baseline !== undefined ? goal.baseline : existingGoal.baseline,
        target: goal.target !== undefined ? goal.target : existingGoal.target,
        currentValue: goal.currentValue !== undefined ? goal.currentValue : existingGoal.currentValue,
        unit: goal.unit || existingGoal.unit,
        notes: goal.notes !== undefined ? goal.notes : existingGoal.notes
      }
    });

    // Log the goal update for analytics
    await prisma.monitoringLog.create({
      data: {
        userId: session.user.id,
        action: 'goal_updated',
        details: JSON.stringify({
          goalId: updatedGoal.id,
          title: updatedGoal.title
        }),
      }
    });

    return NextResponse.json({
      success: true,
      goal: updatedGoal
    });
  } catch (error) {
    console.error('Progress monitoring goal API error:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const goalId = params.goalId;

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.monitoringGoal.findUnique({
      where: {
        id: goalId,
        userId: session.user.id
      }
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Delete all data points associated with this goal
    await prisma.dataPoint.deleteMany({
      where: {
        goalId: goalId
      }
    });

    // Delete the goal
    await prisma.monitoringGoal.delete({
      where: {
        id: goalId
      }
    });

    // Log the goal deletion for analytics
    await prisma.monitoringLog.create({
      data: {
        userId: session.user.id,
        action: 'goal_deleted',
        details: JSON.stringify({
          goalId: goalId,
          title: existingGoal.title
        }),
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Progress monitoring goal API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
