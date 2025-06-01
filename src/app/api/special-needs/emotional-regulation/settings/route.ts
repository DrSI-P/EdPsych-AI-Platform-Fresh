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
    
    // Get emotional regulation settings for the user
    const settings = await (prisma as any).emotionalRegulationSettings.findUnique({
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
    console.error('Error fetching emotional regulation settings:', error);
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
    if (!data.emotionVocabularyLevel || !data.preferredStrategies || !data.selfMonitoringLevel) {
      return NextResponse.json({ error: 'Required settings are missing' }, { status: 400 });
    }
    
    // Create or update settings
    const settings = await (prisma as any).emotionalRegulationSettings.upsert({
      where: { userId },
      update: {
        emotionVocabularyLevel: data.emotionVocabularyLevel,
        preferredStrategies: data.preferredStrategies,
        triggerAwareness: data.triggerAwareness ?? true,
        selfMonitoringLevel: data.selfMonitoringLevel,
        notificationPreferences: data.notificationPreferences || {},
        updatedAt: new Date(),
      },
      create: {
        userId,
        emotionVocabularyLevel: data.emotionVocabularyLevel,
        preferredStrategies: data.preferredStrategies,
        triggerAwareness: data.triggerAwareness ?? true,
        selfMonitoringLevel: data.selfMonitoringLevel,
        notificationPreferences: data.notificationPreferences || {},
      },
    });
    
    // Log the activity
    await (prisma as any).emotionalRegulationLog.create({
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
    console.error('Error saving emotional regulation settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
