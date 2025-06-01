import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for managing data points for a specific goal
 * 
 * This endpoint handles creating and retrieving data points for progress monitoring.
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

    // Check if goal exists and belongs to user
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

    // Get data points for this goal
    const dataPoints = await prisma.dataPoint.findMany({
      where: {
        goalId: goalId
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      dataPoints: dataPoints.map(point => ({
        id: point.id,
        date: point.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        value: point.value,
        notes: point.notes
      }))
    });
  } catch (error) {
    console.error('Data points API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve data points' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    // Parse request body
    const body = await req.json();
    const { dataPoint } = body;

    if (!dataPoint) {
      return NextResponse.json(
        { error: 'Data point object is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!dataPoint.date || dataPoint.value === undefined) {
      return NextResponse.json(
        { error: 'Missing required data point fields' },
        { status: 400 }
      );
    }

    // Create data point
    const newDataPoint = await prisma.dataPoint.create({
      data: {
        goalId: goalId,
        date: new Date(dataPoint.date),
        value: dataPoint.value,
        notes: dataPoint.notes || ''
      }
    });

    // Update current value in the goal
    await prisma.monitoringGoal.update({
      where: {
        id: goalId
      },
      data: {
        currentValue: dataPoint.value
      }
    });

    // Log the data point creation for analytics
    await prisma.monitoringLog.create({
      data: {
        userId: session.user.id,
        action: 'data_point_added',
        details: JSON.stringify({
          goalId: goalId,
          dataPointId: newDataPoint.id,
          value: newDataPoint.value
        }),
      }
    });

    return NextResponse.json({
      success: true,
      dataPoint: {
        id: newDataPoint.id,
        date: newDataPoint.date.toISOString().split('T')[0],
        value: newDataPoint.value,
        notes: newDataPoint.notes
      }
    });
  } catch (error) {
    console.error('Data points API error:', error);
    return NextResponse.json(
      { error: 'Failed to create data point' },
      { status: 500 }
    );
  }
}
