import { NextRequest, NextResponse } from 'next/server';
import AvatarService, { AvatarProvider } from '@/lib/ai-avatar/avatar-service-server';

// Initialize the avatar service with API keys from environment variables
const avatarService = new AvatarService({
  defaultProvider: (process.env.DEFAULT_AVATAR_PROVIDER as AvatarProvider) || 'veed',
  veedApiKey: process.env.VEED_API_KEY,
  simliApiKey: process.env.SIMLI_API_KEY,
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  heygenApiKey: process.env.HEYGEN_API_KEY,
});

/**
 * POST /api/ai-avatar/profile
 * Create a new avatar profile
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.provider) {
      return NextResponse.json(
        { error: 'Missing required fields: name and provider are required' },
        { status: 400 }
      );
    }
    
    // Create avatar profile
    const profile = await avatarService.createAvatarProfile({
      name: data.name,
      provider: data.provider as AvatarProvider,
      imageUrl: data.imageUrl,
      providerSpecificId: data.providerSpecificId,
      voiceId: data.voiceId,
      ageGroup: data.ageGroup,
      style: data.style,
      accentPreference: data.accentPreference,
    });
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error creating avatar profile:', error);
    return NextResponse.json(
      { error: 'Failed to create avatar profile' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai-avatar/video/:id
 * Get the status of a video generation job
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }
    
    const status = await avatarService.getVideoStatus(videoId);
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error getting video status:', error);
    return NextResponse.json(
      { error: 'Failed to get video status' },
      { status: 500 }
    );
  }
}

// Video generation moved to /api/ai-avatar/video/route.ts
