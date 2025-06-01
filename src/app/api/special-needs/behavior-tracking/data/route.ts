import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Define interfaces for tracking data
interface TrackingFilters {
  userId: string;
  studentId?: string;
  behaviorId?: string;
  date?: {
    gte?: Date;
    lte?: Date;
  };
}

interface TrackingData {
  behaviorId: string;
  date: string;
  studentId?: string;
  count?: number;
  notes?: string;
  context?: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get tracking data for the current user
    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const behaviorId = searchParams.get('behaviorId');
    
    // Build the where clause based on filters
    const where: TrackingFilters = {
      userId: session.user.id,
    };
    
    if (studentId && studentId !== 'all') {
      where.studentId = studentId;
    }
    
    if (behaviorId) {
      where.behaviorId = behaviorId;
    }
    
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }
    
    const trackingData = await prisma.behaviorTracking.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
      include: {
        behaviour: true,
      },
    });
    
    return NextResponse.json(trackingData);
  } catch (error) {
    // Using type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json() as TrackingData;
    
    // Validate required fields
    if (!data.behaviorId || !data.date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get the behaviour to calculate points
    const behaviour = await prisma.behaviorDefinition.findUnique({
      where: {
        id: data.behaviorId,
      },
    });
    
    if (!behaviour) {
      return NextResponse.json({ error: 'Behaviour not found' }, { status: 404 });
    }
    
    // Calculate points based on behaviour point value and count
    const pointsEarned = behaviour.pointValue * (data.count || 1);
    
    // Create new tracking entry
    const tracking = await prisma.behaviorTracking.create({
      data: {
        userId: session.user.id,
        behaviorId: data.behaviorId,
        studentId: data.studentId,
        date: new Date(data.date),
        count: data.count || 1,
        notes: data.notes || '',
        context: data.context || '',
        pointsEarned,
      },
    });
    
    // Update student points if student ID is provided
    if (data.studentId) {
      await prisma.student.update({
        where: {
          id: data.studentId,
        },
        data: {
          points: {
            increment: pointsEarned,
          },
        },
      });
    }
    
    // Check if this tracking helps achieve any goals
    const activeGoals = await prisma.behaviorGoal.findMany({
      where: {
        userId: session.user.id,
        targetBehavior: data.behaviorId,
        status: 'active',
        studentId: data.studentId || undefined,
      },
    });
    
    // For each active goal, check if it's been achieved
    for (const goal of activeGoals) {
      // Get total count for this behaviour in the goal's timeframe
      const timeframeStart = new Date();
      switch (goal.timeframe) {
        case 'daily':
          timeframeStart.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          timeframeStart.setDate(timeframeStart.getDate() - timeframeStart.getDay());
          timeframeStart.setHours(0, 0, 0, 0);
          break;
        case 'monthly':
          timeframeStart.setDate(1);
          timeframeStart.setHours(0, 0, 0, 0);
          break;
        case 'term':
          // Assuming a term is roughly 3 months
          timeframeStart.setMonth(timeframeStart.getMonth() - 3);
          timeframeStart.setHours(0, 0, 0, 0);
          break;
      }
      
      const totalCount = await prisma.behaviorTracking.aggregate({
        where: {
          userId: session.user.id,
          behaviorId: data.behaviorId,
          studentId: data.studentId || undefined,
          date: {
            gte: timeframeStart,
          },
        },
        _sum: {
          count: true,
        },
      });
      
      const currentTotal = totalCount._sum.count || 0;
      
      // If goal is achieved, update its status
      if (currentTotal >= goal.targetValue) {
        await prisma.behaviorGoal.update({
          where: {
            id: goal.id,
          },
          data: {
            status: 'completed',
            completedAt: new Date(),
          },
        });
        
        // Log goal completion
        await prisma.behaviorTrackingLog.create({
          data: {
            userId: session.user.id,
            action: 'GOAL_COMPLETED',
            details: JSON.stringify({
              goalId: goal.id,
              goalName: goal.name,
              targetValue: goal.targetValue,
              achievedValue: currentTotal,
            }),
          },
        });
        
        // If there's a reward associated with this goal, create a reward redemption
        if (goal.reward) {
          await prisma.rewardRedemption.create({
            data: {
              userId: session.user.id,
              studentId: data.studentId,
              rewardId: goal.reward,
              goalId: goal.id,
              status: 'pending',
            },
          });
        }
      }
    }
    
    // Log the tracking creation
    await prisma.behaviorTrackingLog.create({
      data: {
        userId: session.user.id,
        action: 'BEHAVIOR_TRACKED',
        details: JSON.stringify({
          trackingId: tracking.id,
          behaviorId: data.behaviorId,
          behaviorName: behaviour.name,
          count: data.count || 1,
          pointsEarned,
        }),
      },
    });
    
    return NextResponse.json(tracking);
  } catch (error) {
    // Using type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json({ error: 'Failed to record behaviour' }, { status: 500 });
  }
}
