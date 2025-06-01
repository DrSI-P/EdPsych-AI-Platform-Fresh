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
    
    // Get social skills settings for the user
    const settings = await prisma.socialSkillsSettings.findUnique({
      where: { userId },
    });
    
    if (!settings) {
      return NextResponse.json({ 
        message: 'No settings found',
        settings: null 
      });
    }
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching social skills settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
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
    if (!data.focusAreas || !Array.isArray(data.focusAreas) || data.focusAreas.length === 0) {
      return NextResponse.json({ error: 'At least one focus area is required' }, { status: 400 });
    }
    
    // Create or update settings
    const settings = await prisma.socialSkillsSettings.upsert({
      where: { userId },
      update: {
        focusAreas: data.focusAreas,
        difficultyLevel: data.difficultyLevel || 'medium',
        environmentSettings: data.environmentSettings || {},
        updatedAt: new Date(),
      },
      create: {
        userId,
        focusAreas: data.focusAreas,
        difficultyLevel: data.difficultyLevel || 'medium',
        environmentSettings: data.environmentSettings || {},
      },
    });
    
    // Log the activity
    await prisma.socialSkillsLog.create({
      data: {
        userId,
        action: 'settings_updated',
        details: { settings },
      },
    });
    
    return NextResponse.json({ 
      message: 'Settings saved successfully',
      settings 
    });
  } catch (error) {
    console.error('Error saving social skills settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
