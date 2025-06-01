import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get behaviour tracking settings for the current user
    const settings = await (prisma as any).behaviorTrackingSettings.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    
    // If no settings exist, return default settings
    if (!settings) {
      return NextResponse.json({
        enablePositiveReinforcement: true,
        enableBehaviorTracking: true,
        enableRewards: true,
        enableGoals: true,
        enableParentAccess: true,
        enableStudentAccess: true,
        notifyParentsOnAchievements: true,
        notifyParentsOnChallenges: true,
        defaultTrackingFrequency: 'daily',
        defaultRewardSystem: 'points',
        defaultGoalFrequency: 'weekly',
        customizableRewards: true
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching behaviour tracking settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Validate required fields
    if (data.defaultTrackingFrequency === undefined || 
        data.defaultRewardSystem === undefined || 
        data.defaultGoalFrequency === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Update or create settings
    const settings = await (prisma as any).behaviorTrackingSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        enablePositiveReinforcement: data.enablePositiveReinforcement,
        enableBehaviorTracking: data.enableBehaviorTracking,
        enableRewards: data.enableRewards,
        enableGoals: data.enableGoals,
        enableParentAccess: data.enableParentAccess,
        enableStudentAccess: data.enableStudentAccess,
        notifyParentsOnAchievements: data.notifyParentsOnAchievements,
        notifyParentsOnChallenges: data.notifyParentsOnChallenges,
        defaultTrackingFrequency: data.defaultTrackingFrequency,
        defaultRewardSystem: data.defaultRewardSystem,
        defaultGoalFrequency: data.defaultGoalFrequency,
        customizableRewards: data.customizableRewards,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        enablePositiveReinforcement: data.enablePositiveReinforcement,
        enableBehaviorTracking: data.enableBehaviorTracking,
        enableRewards: data.enableRewards,
        enableGoals: data.enableGoals,
        enableParentAccess: data.enableParentAccess,
        enableStudentAccess: data.enableStudentAccess,
        notifyParentsOnAchievements: data.notifyParentsOnAchievements,
        notifyParentsOnChallenges: data.notifyParentsOnChallenges,
        defaultTrackingFrequency: data.defaultTrackingFrequency,
        defaultRewardSystem: data.defaultRewardSystem,
        defaultGoalFrequency: data.defaultGoalFrequency,
        customizableRewards: data.customizableRewards,
      },
    });
    
    // Log the settings update
    await (prisma as any).behaviorTrackingLog.create({
      data: {
        userId: session.user.id,
        action: 'SETTINGS_UPDATE',
        details: JSON.stringify(data),
      },
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving behaviour tracking settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
