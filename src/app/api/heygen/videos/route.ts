/**
 * HEYGEN Video API Routes
 * 
 * This API route handles video operations for the HEYGEN integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { HeygenService } from '@/lib/heygen/heygen-service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { db } from '@/lib/db';

// Initialize HEYGEN service
const initializeHeygenService = async () => {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new Error('HEYGEN_API_KEY environment variable is not set');
  }
  
  const heygenService = HeygenService.getInstance();
  if (!heygenService['initialized']) {
    await heygenService.initialize(apiKey);
  }
  return heygenService;
};

// Get all videos for the current user
export async function GET(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Initialize HEYGEN service
    const heygenService = await initializeHeygenService();
    
    // Get videos for the user
    const videos = await heygenService.getUserVideos(userId);
    
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching HEYGEN videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

// Create a new video
export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Parse request body
    const body = await req.json();
    const { avatar_id, text, voice_id, title, description, background } = body;
    
    // Validate required fields
    if (!avatar_id || !text) {
      return NextResponse.json({ error: 'Missing required fields: avatar_id and text are required' }, { status: 400 });
    }
    
    // Initialize HEYGEN service
    const heygenService = await initializeHeygenService();
    
    // Generate video
    const result = await heygenService.generateVideo({
      avatar_id,
      text,
      voice_id,
      title: title || 'Untitled Video',
      description,
      background,
      metadata: {
        userId,
        createdBy: session.user.email || session.user.name || 'Unknown'
      }
    }, userId);
    
    // Log the video creation
    await db.activityLogs.create({
      data: {
        userId,
        action: 'CREATE_VIDEO',
        details: {
          videoId: result.id,
          title: title || 'Untitled Video'
        }
      }
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating HEYGEN video:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}
