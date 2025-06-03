import { NextRequest, NextResponse } from 'next/server';
import { HeygenAPI } from '@/lib/heygen/heygen-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { avatar_id, voice_id, quality = 'high', avatar_style = 'normal' } = body;

    // Validate required parameters
    if (!avatar_id) {
      return NextResponse.json(
        { error: 'Avatar ID is required' },
        { status: 400 }
      );
    }

    // Get HeyGen API key from environment
    const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
    if (!apiKey || apiKey === 'your_heygen_api_key_here') {
      return NextResponse.json(
        { error: 'HeyGen API key not configured' },
        { status: 500 }
      );
    }

    // Initialize HeyGen API
    const heygenApi = HeygenAPI.getInstance();
    heygenApi.initialize(apiKey);

    // Create streaming session
    const sessionResponse = await fetch('https://api.heygen.com/v1/streaming.new', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar_id,
        voice_id,
        quality,
        avatar_style,
        version: 'v1_text_mode'
      })
    });

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json();
      console.error('HeyGen streaming session creation failed:', errorData);
      return NextResponse.json(
        { error: 'Failed to create streaming session', details: errorData },
        { status: sessionResponse.status }
      );
    }

    const sessionData = await sessionResponse.json();

    return NextResponse.json({
      session_id: sessionData.session_id,
      avatar_id,
      voice_id,
      quality,
      status: 'created',
      websocket_url: sessionData.websocket_url || `wss://api.heygen.com/v1/streaming/${sessionData.session_id}`,
      created_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error creating HeyGen streaming session:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create a streaming session.' },
    { status: 405 }
  );
}

