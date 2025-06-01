import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * API endpoint for high contrast mode settings
 * 
 * This endpoint handles saving and retrieving user high contrast preferences
 * across the platform, ensuring a consistent experience for users with
 * visual impairments or reading difficulties.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { settings } = body;
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }
    
    // Validate settings
    const validatedSettings = {
      highContrastMode: Boolean(settings.highContrastMode),
      contrastMode: settings.contrastMode || 'high-contrast',
      textSize: Number(settings.textSize) || 100,
      contrastLevel: Number(settings.contrastLevel) || 100,
      reduceAnimations: Boolean(settings.reduceAnimations),
      customTextColor: settings.customTextColor || '#ffffff',
      customBackgroundColor: settings.customBackgroundColor || '#000000',
      customLinkColor: settings.customLinkColor || '#ffff00',
    };
    
    // Save settings to database (upsert to create or update)
    const updatedSettings = await db.prisma.accessibilitySettings.upsert({
      where: {
        userId: session.user.id
      },
      update: validatedSettings,
      create: {
        userId: session.user.id,
        ...validatedSettings
      }
    });
    
    // Log the high contrast mode usage for analytics
    await db.prisma.accessibilityLog.create({
      data: {
        userId: session.user.id,
        action: 'setting_changed',
        feature: 'high-contrast-mode',
        details: JSON.stringify(validatedSettings),
      }
    });
    
    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('High contrast mode API error:', error);
    return NextResponse.json(
      { error: 'Failed to save high contrast mode settings' },
      { status: 500 }
    );
  }
}
