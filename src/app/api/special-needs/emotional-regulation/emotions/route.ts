import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get emotion records for the user
    const emotions = await (prisma as any).emotionRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        strategies: true
      }
    });
    
    return NextResponse.json({ emotions });
  } catch (error) {
    console.error('Error fetching emotion records:', error);
    return NextResponse.json({ error: 'Failed to fetch emotion records' }, { status: 500 });
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
    if (!data.name || !data.intensity) {
      return NextResponse.json({ error: 'Emotion name and intensity are required' }, { status: 400 });
    }
    
    // Create new emotion record
    const emotion = await (prisma as any).emotionRecord.create({
      data: {
        userId,
        name: data.name,
        intensity: data.intensity,
        triggers: data.triggers || null,
        bodyFeelings: data.bodyFeelings || [],
        thoughts: data.thoughts || null,
      },
    });
    
    // Log the activity
    await (prisma as any).emotionalRegulationLog.create({
      data: {
        userId,
        action: 'emotion_recorded',
        details: { emotionId: emotion.id },
      },
    });
    
    return NextResponse.json({ 
      message: 'Emotion recorded successfully',
      emotion 
    });
  } catch (error) {
    console.error('Error recording emotion:', error);
    return NextResponse.json({ error: 'Failed to record emotion' }, { status: 500 });
  }
}
