import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { db } from '@/lib/db';
import { getVideoForUser, getPreGeneratedVideosByCategory } from '@/lib/heygen/cost-management';
import { getEnv } from '@/lib/env-validator';

/**
 * HEYGEN API Cost Management Controller
 * 
 * This API route handles the cost-effective generation and management of AI videos
 * using the HEYGEN API, with tier-based access controls and credit management.
 */
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    const { text, avatarId, voiceId } = body;
    
    if (!text || !avatarId || !voiceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the user from the database
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Generate the video using cost management strategies
    try {
      const result = await getVideoForUser({
        userId: user.id,
        text,
        avatarId,
        voiceId,
      });
      
      return NextResponse.json({
        videoUrl: result.videoUrl,
        fromCache: result.fromCache,
      });
    } catch (error: any) {
      // Handle specific error cases
      if (error.message.includes('Free tier video limit reached')) {
        return NextResponse.json(
          { 
            error: error.message,
            code: 'FREE_TIER_LIMIT',
            upgradeUrl: '/pricing'
          },
          { status: 403 }
        );
      } else if (error.message.includes('Not enough credits')) {
        return NextResponse.json(
          { 
            error: error.message,
            code: 'INSUFFICIENT_CREDITS',
            purchaseUrl: '/credits'
          },
          { status: 403 }
        );
      } else {
        throw error; // Re-throw for general error handling
      }
    }
  } catch (error) {
    console.error('Error generating video:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }
    
    // Get pre-generated videos for the specified category
    const videos = await getPreGeneratedVideosByCategory(category);
    
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching pre-generated videos:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch pre-generated videos' },
      { status: 500 }
    );
  }
}
