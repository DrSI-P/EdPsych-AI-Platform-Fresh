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
 * GET /api/ai-avatar/video/:id
 * Get the status of a video generation job
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;
    
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
