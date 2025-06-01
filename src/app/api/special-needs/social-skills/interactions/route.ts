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
    
    // Get peer interactions for the user
    const interactions = await db.prisma.peerInteraction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ interactions });
  } catch (error) {
    console.error('Error fetching peer interactions:', error);
    return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 });
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
    if (!data.interactionType || !data.participants || !data.duration || !data.setting || data.successRating === undefined) {
      return NextResponse.json({ 
        error: 'Interaction type, participants, duration, setting, and success rating are required' 
      }, { status: 400 });
    }
    
    // Create new peer interaction
    const interaction = await db.prisma.peerInteraction.create({
      data: {
        userId,
        interactionType: data.interactionType,
        participants: data.participants,
        duration: data.duration,
        setting: data.setting,
        successRating: data.successRating,
        notes: data.notes || null,
      },
    });
    
    // Log the interaction creation
    await db.prisma.socialSkillsLog.create({
      data: {
        userId,
        action: 'interaction_recorded',
        details: { interactionId: interaction.id },
      },
    });
    
    return NextResponse.json({ 
      message: 'Peer interaction recorded successfully',
      interaction 
    });
  } catch (error) {
    console.error('Error recording peer interaction:', error);
    return NextResponse.json({ error: 'Failed to record peer interaction' }, { status: 500 });
  }
}
