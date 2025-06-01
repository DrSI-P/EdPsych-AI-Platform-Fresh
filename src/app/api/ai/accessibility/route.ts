import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface AccessibilitySettings {
  textSize: number;
  lineSpacing: number;
  highContrastMode: boolean;
  contrastMode?: string;
  contrastLevel?: number;
  reduceAnimations?: boolean;
  customTextColor?: string;
  customBackgroundColor?: string;
  customLinkColor?: string;
  screenReaderOptimized: boolean;
  dyslexiaFriendly: boolean;
  dyslexiaFont: string;
  voiceInputEnabled: boolean;
  voiceCommandsEnabled: boolean;
  keyboardNavigationOptimized: boolean;
  focusIndicators: boolean;
  reduceMotion: boolean;
  colorBlindnessType?: string;
  voiceRecognitionActive?: boolean;
}

interface RequestBody {
  settings: Partial<AccessibilitySettings>;
}

/**
 * API endpoint for accessibility settings
 * 
 * This endpoint handles saving and retrieving user accessibility preferences
 * across the platform, ensuring a consistent experience for users with
 * different needs.
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user's accessibility settings from database
    const settings = await db.prisma.accessibilitySettings.findUnique({
      where: {
        userId: session.user.id
      }
    });
    
    // Return settings or default values
    return NextResponse.json({
      success: true,
      settings: settings || {
        textSize: 100,
        lineSpacing: 150,
        highContrastMode: false,
        dyslexiaFont: "opendyslexic",
        dyslexiaFriendly: false,
        reduceMotion: false,
        voiceInputEnabled: false,
        voiceCommandsEnabled: false,
        screenReaderOptimized: false,
        keyboardNavigationOptimized: false,
        focusIndicators: true
      }
    });
  } catch (error) {
    console.error('Accessibility API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve accessibility settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json() as RequestBody;
    const { settings } = body;
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }
    
    // Validate settings - ensure types match schema definitions
    // Only include fields that exist in the AccessibilitySettings model
    const validatedSettings: Partial<AccessibilitySettings> = {
      textSize: Number(settings.textSize) || 100,
      lineSpacing: Number(settings.lineSpacing) || 150,
      highContrastMode: Boolean(settings.highContrastMode),
      contrastMode: settings.contrastMode || "high-contrast",
      contrastLevel: Number(settings.contrastLevel) || 100,
      reduceAnimations: Boolean(settings.reduceAnimations || false),
      customTextColor: settings.customTextColor || undefined,
      customBackgroundColor: settings.customBackgroundColor || undefined,
      customLinkColor: settings.customLinkColor || undefined,
      screenReaderOptimized: Boolean(settings.screenReaderOptimized || false),
      dyslexiaFriendly: Boolean(settings.dyslexiaFriendly || false),
      dyslexiaFont: settings.dyslexiaFont || "opendyslexic",
      voiceInputEnabled: Boolean(settings.voiceInputEnabled || settings.voiceRecognitionActive || false),
      voiceCommandsEnabled: Boolean(settings.voiceCommandsEnabled || false),
      keyboardNavigationOptimized: Boolean(settings.keyboardNavigationOptimized || false),
      focusIndicators: Boolean(settings.focusIndicators || true),
      reduceMotion: Boolean(settings.reduceMotion || false),
      colorBlindnessType: settings.colorBlindnessType || undefined
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
    
    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Accessibility API error:', error);
    return NextResponse.json(
      { error: 'Failed to save accessibility settings' },
      { status: 500 }
    );
  }
}
