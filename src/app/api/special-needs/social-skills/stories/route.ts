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
    
    // Get social stories for the user
    const stories = await prisma.socialStory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error fetching social stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
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
    if (!data.title || !data.targetSkill || !data.content || !data.ageRange) {
      return NextResponse.json({ 
        error: 'Title, target skill, content, and age range are required' 
      }, { status: 400 });
    }
    
    // Create new social story
    const story = await prisma.socialStory.create({
      data: {
        userId,
        title: data.title,
        targetSkill: data.targetSkill,
        content: data.content,
        illustrations: data.illustrations || {},
        ageRange: data.ageRange,
      },
    });
    
    // Log the story creation
    await prisma.socialSkillsLog.create({
      data: {
        userId,
        action: 'story_created',
        details: { storyId: story.id },
      },
    });
    
    return NextResponse.json({ 
      message: 'Social story created successfully',
      story 
    });
  } catch (error) {
    console.error('Error creating social story:', error);
    return NextResponse.json({ error: 'Failed to create social story' }, { status: 500 });
  }
}
