/**
 * HEYGEN Video Detail API Route
 * 
 * This API route handles operations for specific HEYGEN videos
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

// Get a specific video
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const videoId = params.id;
    
    // Initialize HEYGEN service
    const heygenService = await initializeHeygenService();
    
    // Get the video
    const video = await heygenService.getVideo(videoId);
    
    // Check if user has access to this video
    const userVideosResult = await db.userVideos.findMany({
      where: {
        videoId,
        userId
      },
      take: 1
    });
    const userVideo = userVideosResult.length > 0 ? userVideosResult[0] : null;
    
    // If video doesn't belong to user and isn't public, deny access
    if (!userVideo && video.metadata?.userId !== userId && !video.metadata?.isPublic) {
      return NextResponse.json({ error: 'Video not found or access denied' }, { status: 404 });
    }
    
    // Log the video view
    await db.activityLogs.create({
      data: {
        userId,
        action: 'VIEW_VIDEO',
        details: {
          videoId,
          title: video.title
        }
      }
    });
    
    return NextResponse.json({ video });
  } catch (error) {
    console.error(`Error fetching HEYGEN video ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

// Delete a video
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const videoId = params.id;
    
    // Initialize HEYGEN service
    const heygenService = await initializeHeygenService();
    
    // Delete the video
    const result = await heygenService.deleteVideo(videoId, userId);
    
    // Log the video deletion
    await db.activityLogs.create({
      data: {
        userId,
        action: 'DELETE_VIDEO',
        details: {
          videoId
        }
      }
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error deleting HEYGEN video ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
