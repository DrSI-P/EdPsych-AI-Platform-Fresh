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
    
    // Get journal entries for the user
    const journal = await (prisma as any).emotionJournal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        strategies: true
      }
    });
    
    return NextResponse.json({ journal });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
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
    if (!data.title || !data.content || !data.emotions) {
      return NextResponse.json({ error: 'Title, content, and emotions are required' }, { status: 400 });
    }
    
    // Create new journal entry
    const journal = await (prisma as any).emotionJournal.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        emotions: data.emotions,
        strategies: {
          connect: (data.strategies || []).map((strategyId: string) => ({
            id: strategyId
          }))
        }
      },
    });
    
    // Log the activity
    await (prisma as any).emotionalRegulationLog.create({
      data: {
        userId,
        action: 'journal_created',
        details: { journalId: journal.id },
      },
    });
    
    return NextResponse.json({ 
      message: 'Journal entry created successfully',
      journal 
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 });
  }
}
