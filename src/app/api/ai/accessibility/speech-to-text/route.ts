import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for speech-to-text functionality
 * 
 * This endpoint handles logging and processing of speech-to-text conversions,
 * providing analytics and personalized optimizations based on user history.
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
    const { text, duration, confidence, settings } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Log the speech-to-text usage for analytics and personalization
    await prisma.accessibilityLog.create({
      data: {
        userId: session.user.id,
        action: 'feature_used',
        feature: 'speech-to-text',
        details: JSON.stringify({
          ...(settings || {}),
          textLength: text.length,
          duration: duration,
          confidence: confidence
        }),
      }
    });

    // Update user's accessibility settings if they've changed
    if (settings) {
      await prisma.accessibilitySettings.upsert({
        where: {
          userId: session.user.id
        },
        update: {
          voiceInputEnabled: true,
          // Restore the speech settings now that they're in the schema
          speechRate: settings.speechRate || 1.0,
          speechPitch: settings.speechPitch || 1.0
        },
        create: {
          userId: session.user.id,
          voiceInputEnabled: true,
          // Restore the speech settings now that they're in the schema
          speechRate: settings.speechRate || 1.0,
          speechPitch: settings.speechPitch || 1.0,
          // Required default values for other fields
          textSize: 100,
          lineSpacing: 150,
          highContrastMode: false,
          contrastMode: "high-contrast",
          contrastLevel: 100,
          reduceAnimations: false,
          screenReaderOptimized: false,
          dyslexiaFriendly: false,
          dyslexiaFont: "opendyslexic",
          voiceCommandsEnabled: false,
          keyboardNavigationOptimized: false,
          focusIndicators: true,
          reduceMotion: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Speech-to-text conversion logged successfully'
    });
  } catch (error) {
    console.error('Speech-to-text API error:', error);
    return NextResponse.json(
      { error: 'Failed to process speech-to-text request' },
      { status: 500 }
    );
  }
}
