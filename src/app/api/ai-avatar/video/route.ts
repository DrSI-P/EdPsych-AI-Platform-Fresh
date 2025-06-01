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
 * POST /api/ai-avatar/video
 * Generate a new video
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.script || !data.avatarProfileId) {
      return NextResponse.json(
        { error: 'Missing required fields: script and avatarProfileId are required' },
        { status: 400 }
      );
    }
    
    // Generate video
    const result = await avatarService.generateVideo({
      script: data.script,
      avatarProfileId: data.avatarProfileId,
      outputFormat: data.outputFormat,
      resolution: data.resolution,
      background: data.background,
      customBackgroundUrl: data.customBackgroundUrl,
      includeSubtitles: data.includeSubtitles,
      subtitleLanguage: data.subtitleLanguage,
      maxDuration: data.maxDuration,
      callToAction: data.callToAction,
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
