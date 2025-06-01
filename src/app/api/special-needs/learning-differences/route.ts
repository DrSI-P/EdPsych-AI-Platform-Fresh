import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    
    // Get user profile and learning difference settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        learningDifferenceProfile: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return different data based on request type
    switch (type) {
      case 'settings':
        return NextResponse.json({ 
          settings: user.learningDifferenceProfile?.settings || null,
          assessmentResults: user.learningDifferenceProfile?.assessmentResults || null
        });
        
      case 'assessment':
        return NextResponse.json({ 
          assessmentResults: user.learningDifferenceProfile?.assessmentResults || null
        });
        
      case 'all':
      default:
        return NextResponse.json({
          profile: user.learningDifferenceProfile,
          settings: user.learningDifferenceProfile?.settings || null,
          assessmentResults: user.learningDifferenceProfile?.assessmentResults || null
        });
    }
  } catch (error) {
    console.error('Error in learning differences API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { type, data } = await req.json();
    
    switch (type) {
      case 'settings':
        // Create or update learning difference settings
        const profile = await prisma.learningDifferenceProfile.upsert({
          where: {
            userId
          },
          update: {
            settings: data,
            updatedAt: new Date()
          },
          create: {
            userId,
            settings: data,
            assessmentResults: {} // Add default empty object for assessmentResults
          }
        });
        
        return NextResponse.json({ settings: profile.settings });
        
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in learning differences API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { type, data } = await req.json();
    
    switch (type) {
      case 'settings':
        // Update learning difference settings
        const profile = await prisma.learningDifferenceProfile.update({
          where: {
            userId
          },
          data: {
            settings: data,
            updatedAt: new Date()
          }
        });
        
        return NextResponse.json({ settings: profile.settings });
        
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in learning differences API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
