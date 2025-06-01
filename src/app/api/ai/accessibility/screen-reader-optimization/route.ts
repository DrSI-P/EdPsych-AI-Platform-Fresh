import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for screen reader optimization settings
 * 
 * This endpoint handles saving and retrieving user screen reader optimization preferences
 * across the platform, ensuring a consistent experience for users who rely on
 * screen readers for accessing digital content.
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

    // Validate settings - ensure types match schema definitions
    const validatedSettings = {
      screenReaderOptimized: Boolean(settings.screenReaderOptimization),
      // Only include fields that exist in the AccessibilitySettings model
      // and ensure their types match the schema
      dyslexiaFriendly: Boolean(settings.improvedAltText || false),
      dyslexiaFont: settings.dyslexiaFont ? String(settings.dyslexiaFont) : "opendyslexic",
    };

    // Save settings to database (upsert to create or update)
    const updatedSettings = await prisma.accessibilitySettings.upsert({
      where: {
        userId: session.user.id
      },
      update: validatedSettings,
      create: {
        userId: session.user.id,
        ...validatedSettings
      }
    });

    // Log the screen reader optimization usage for analytics
    await prisma.accessibilityLog.create({
      data: {
        userId: session.user.id,
        action: 'setting_changed',
        feature: 'screen-reader-optimization',
        details: JSON.stringify({
          screenReaderOptimization: settings.screenReaderOptimization,
          enhancedAria: settings.enhancedAria,
          improvedAltText: settings.improvedAltText,
          semanticHeadings: settings.semanticHeadings,
          tableAccessibility: settings.tableAccessibility,
          formLabels: settings.formLabels,
          readingOrder: settings.readingOrder,
          announcementLevel: settings.announcementLevel
        }),
      }
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Screen reader optimization API error:', error);
    return NextResponse.json(
      { error: 'Failed to save screen reader optimization settings' },
      { status: 500 }
    );
  }
}
