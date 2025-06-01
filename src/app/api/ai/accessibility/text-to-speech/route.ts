import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for text-to-speech functionality
 * 
 * This endpoint handles text-to-speech requests, providing a server-side
 * implementation that can be used when client-side Web Speech API is not
 * available or for more advanced processing needs.
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
    const { text, options } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Default options
    const defaultOptions = {
      voice: 'en-GB', // UK English voice
      rate: 1.0,      // Normal speaking rate
      pitch: 1.0,     // Normal pitch
      volume: 1.0     // Full volume
    };

    // Merge with user options
    const speechOptions = {
      ...defaultOptions,
      ...options
    };

    // Log the request for analytics (optional)
    await prisma.accessibilityLog.create({
      data: {
        userId: session.user.id,
        action: 'feature_used',
        feature: 'text-to-speech',
        details: JSON.stringify({
          ...speechOptions,
          textCharCount: text.length
        })
      }
    });

    // In a production environment, this would connect to a TTS service
    // For now, we'll return the text and options for client-side processing
    return NextResponse.json({
      success: true,
      text,
      options: speechOptions,
      message: 'Text-to-speech request processed successfully'
    });
  } catch (error) {
    console.error('Text-to-speech API error:', error);
    return NextResponse.json(
      { error: 'Failed to process text-to-speech request' },
      { status: 500 }
    );
  }
}
