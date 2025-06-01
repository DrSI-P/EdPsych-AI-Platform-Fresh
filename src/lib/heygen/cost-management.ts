/**
 * HEYGEN API Cost Management System
 * 
 * This module provides strategies and utilities for managing HEYGEN API costs,
 * particularly for free users, to ensure business sustainability while providing
 * a good user experience.
 */

import { db } from '@/lib/db';
import cacheModule from '@/lib/cache';
import HeygenAPI from './heygen-api';

// Create an alias for the cache module with the methods we need
const cache = {
  get: cacheModule.getCacheValue,
  set: cacheModule.setCacheValue
};

// Initialize the HEYGEN API
const heygenApi = HeygenAPI.getInstance();

// Constants for cost management
const CACHE_TTL = 60 * 60 * 24 * 30; // 30 days cache for videos
const FREE_TIER_MAX_VIDEOS = 10; // Maximum number of unique videos a free user can access
const FREE_TIER_VIDEO_QUALITY = 'standard'; // Lower quality for free tier
const FREE_TIER_MAX_DURATION = 30; // Maximum duration in seconds for free tier videos

// Interface for video cache key parameters
interface VideoCacheKeyParams {
  text: string;
  avatarId: string;
  voiceId: string;
  tier: string;
}

// Interface for video generation parameters
interface VideoGenerationParams {
  userId: string;
  text: string;
  avatarId: string;
  voiceId: string;
}

// Interface for video generation result
interface VideoGenerationResult {
  videoUrl: string;
  fromCache: boolean;
}

// Interface for tier-based video parameters
interface TierVideoParams {
  quality: string;
  maxDuration: number;
}

// Interface for pre-generated video script
interface NavigationScript {
  text: string;
  avatarId: string;
  voiceId: string;
  category: string;
}

// Interface for pre-generated video
interface PreGeneratedVideo {
  id: string;
  text: string;
  url: string;
}

// Interface for HEYGEN usage analytics
interface HeygenUsageAnalytics {
  totalVideosGenerated: number;
  totalCacheHits: number;
  estimatedCostSavings: number;
  costByTier: Record<string, number>;
}

/**
 * Video cache key generator
 * Creates a deterministic cache key based on video parameters
 */
export function generateVideoCacheKey(params: VideoCacheKeyParams): string {
  // Create a deterministic hash for the parameters
  const paramsString = JSON.stringify({
    text: params.text.toLowerCase().trim(),
    avatarId: params.avatarId,
    voiceId: params.voiceId,
    tier: params.tier
  });
  
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < paramsString.length; i++) {
    const char = paramsString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `heygen_video_${hash}`;
}

/**
 * Check if a user has reached their free tier video limit
 */
export async function checkFreeTierLimit(userId: string): Promise<boolean> {
  // Get user's current video access count
  const accessCount = await db.videoAccess.count({
    where: {
      userId,
      tier: 'free'
    }
  });
  
  return accessCount < FREE_TIER_MAX_VIDEOS;
}

/**
 * Get video parameters based on user's subscription tier
 */
export function getVideoParamsByTier(tier: string): TierVideoParams {
  switch (tier) {
    case 'free':
      return {
        quality: FREE_TIER_VIDEO_QUALITY,
        maxDuration: FREE_TIER_MAX_DURATION
      };
    case 'standard':
      return {
        quality: 'high',
        maxDuration: 60
      };
    case 'premium':
    case 'family':
      return {
        quality: 'ultra',
        maxDuration: 120
      };
    default:
      return {
        quality: FREE_TIER_VIDEO_QUALITY,
        maxDuration: FREE_TIER_MAX_DURATION
      };
  }
}

/**
 * Get a video for a user, using cost-effective strategies based on their tier
 */
export async function getVideoForUser(params: VideoGenerationParams): Promise<VideoGenerationResult> {
  // Get user's subscription tier
  const user = await db.user.findUnique({
    where: { id: params.userId },
    select: { subscriptionTier: true }
  });
  
  const tier = user?.subscriptionTier || 'free';
  
  // For free tier users, implement strict cost controls
  if (tier === 'free') {
    // Check if user has reached their limit
    const hasRemainingAccess = await checkFreeTierLimit(params.userId);
    if (!hasRemainingAccess) {
      throw new Error('Free tier video limit reached. Please upgrade your subscription.');
    }
    
    // For free tier, we only use pre-generated or cached videos
    const cacheKey = generateVideoCacheKey({
      text: params.text,
      avatarId: params.avatarId,
      voiceId: params.voiceId,
      tier
    });
    
    // Try to get from cache first
    const cachedVideo = await cache.get(cacheKey);
    if (cachedVideo) {
      // Record this access for quota tracking
      await db.videoAccess.create({
        data: {
          userId: params.userId,
          videoId: cacheKey,
          tier: 'free',
          fromCache: true
        }
      });
      
      return { videoUrl: cachedVideo as string, fromCache: true };
    }
    
    // If not in cache, check our pre-generated video library
    const preGeneratedVideo = await db.preGeneratedVideo.findFirst({
      where: {
        textHash: cacheKey.substring(0, 64), // Use part of the cache key as a hash
      }
    });
    
    if (preGeneratedVideo) {
      // Record this access for quota tracking
      await db.videoAccess.create({
        data: {
          userId: params.userId,
          videoId: preGeneratedVideo.id,
          tier: 'free',
          fromCache: true
        }
      });
      
      return { videoUrl: preGeneratedVideo.url, fromCache: true };
    }
    
    // If we get here, we don't have a suitable pre-generated video
    // For free tier, we don't generate new videos on demand
    throw new Error('No suitable pre-generated video found. Please try different text or upgrade your subscription.');
  }
  
  // For paid tiers, we can generate videos on demand, but still use cache when possible
  const cacheKey = generateVideoCacheKey({
    text: params.text,
    avatarId: params.avatarId,
    voiceId: params.voiceId,
    tier
  });
  
  // Try to get from cache first to save costs
  const cachedVideo = await cache.get(cacheKey);
  if (cachedVideo) {
    return { videoUrl: cachedVideo as string, fromCache: true };
  }
  
  // Get appropriate quality parameters for the user's tier
  const { quality, maxDuration } = getVideoParamsByTier(tier);
  
  // Check if the text exceeds the maximum duration for this tier
  // This is a simplistic calculation - in production you'd use a more accurate estimator
  const estimatedDuration = Math.ceil(params.text.length / 15); // Rough estimate: 15 chars per second
  if (estimatedDuration > maxDuration) {
    throw new Error(`Text is too long for your subscription tier. Maximum duration: ${maxDuration} seconds.`);
  }
  
  // Check if user has enough credits remaining
  const creditsRequired = Math.ceil(estimatedDuration / 10); // 1 credit per 10 seconds
  const userCredits = await db.userCredits.findUnique({
    where: { userId: params.userId }
  });
  
  if (!userCredits || userCredits.remainingCredits < creditsRequired) {
    throw new Error(`Not enough credits. Required: ${creditsRequired}, Available: ${userCredits?.remainingCredits || 0}`);
  }
  
  // Generate the video using the HEYGEN API
  try {
    const videoResult = await heygenApi.generateVideo({
      avatar_id: params.avatarId,
      text: params.text,
      voice_id: params.voiceId,
      title: `Generated video for ${params.userId}`,
      metadata: { quality }
    });
    
    // For simplicity, we'll assume the video is immediately available
    // In a real implementation, you'd need to poll for completion
    const videoUrl = `https://api.heygen.com/v1/videos/${videoResult.id}/stream`;
    
    // Deduct credits
    await db.userCredits.update({
      where: { userId: params.userId },
      data: {
        remainingCredits: {
          decrement: creditsRequired
        },
        usedCredits: {
          increment: creditsRequired
        }
      }
    });
    
    // Cache the result to avoid regenerating the same video
    await cache.set(cacheKey, videoUrl, CACHE_TTL);
    
    // Record this generation for analytics
    await db.videoGeneration.create({
      data: {
        userId: params.userId,
        text: params.text,
        avatarId: params.avatarId,
        voiceId: params.voiceId,
        quality,
        creditsUsed: creditsRequired,
        tier,
        cacheKey
      }
    });
    
    return { videoUrl, fromCache: false };
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error('Failed to generate video. Please try again later.');
  }
}

/**
 * Pre-generate common navigation videos for the free tier
 * This should be run as a scheduled job to build up the library of free videos
 */
export async function preGenerateCommonVideos(navigationScripts: NavigationScript[]): Promise<void> {
  for (const script of navigationScripts) {
    const cacheKey = generateVideoCacheKey({
      text: script.text,
      avatarId: script.avatarId,
      voiceId: script.voiceId,
      tier: 'free'
    });
    
    // Check if we already have this video
    const existing = await db.preGeneratedVideo.findFirst({
      where: {
        textHash: cacheKey.substring(0, 64)
      }
    });
    
    if (!existing) {
      try {
        // Generate the video at the free tier quality
        const videoResult = await heygenApi.generateVideo({
          avatar_id: script.avatarId,
          text: script.text,
          voice_id: script.voiceId,
          title: `Pre-generated ${script.category} video`,
          metadata: { quality: FREE_TIER_VIDEO_QUALITY }
        });
        
        // For simplicity, we'll assume the video is immediately available
        // In a real implementation, you'd need to poll for completion
        const videoUrl = `https://api.heygen.com/v1/videos/${videoResult.id}/stream`;
        
        // Store in our pre-generated library
        await db.preGeneratedVideo.create({
          data: {
            textHash: cacheKey.substring(0, 64),
            text: script.text,
            avatarId: script.avatarId,
            voiceId: script.voiceId,
            url: videoUrl,
            category: script.category
          }
        });
        
        // Also cache it
        await cache.set(cacheKey, videoUrl, CACHE_TTL);
        
        console.log(`Pre-generated video for: ${script.text.substring(0, 30)}...`);
      } catch (error) {
        console.error(`Failed to pre-generate video for: ${script.text.substring(0, 30)}...`, error);
      }
      
      // Add a delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Get a list of pre-generated videos for a specific category
 * Used to populate the UI with available free videos
 */
export async function getPreGeneratedVideosByCategory(category: string): Promise<PreGeneratedVideo[]> {
  const videos = await db.preGeneratedVideo.findMany({
    where: { category },
    select: {
      id: true,
      text: true,
      url: true
    }
  });
  
  return videos;
}

/**
 * Analytics function to track HEYGEN API usage and costs
 */
export async function trackHeygenUsage(): Promise<HeygenUsageAnalytics> {
  // Get total videos generated
  const totalGenerated = await db.videoGeneration.count();
  
  // Get cache hits
  const cacheHits = await db.videoAccess.count({
    where: { fromCache: true }
  });
  
  // Calculate estimated cost savings (assuming average cost of £0.25 per video)
  const estimatedSavings = cacheHits * 0.25;
  
  // Get cost breakdown by tier
  const tiers = ['free', 'standard', 'premium', 'family', 'classroom', 'school', 'district'];
  const costByTier: Record<string, number> = {};
  
  for (const tier of tiers) {
    const generationsForTier = await db.videoGeneration.findMany({
      where: { tier }
    });
    
    // Calculate estimated cost for this tier
    // This is a simplified calculation - in production you'd use actual billing data
    const tierCost = generationsForTier.reduce((total, gen) => {
      // Estimate cost based on quality and length
      const qualityMultiplier = gen.quality === 'ultra' ? 1.5 : gen.quality === 'high' ? 1.0 : 0.5;
      const estimatedCost = gen.creditsUsed * 0.25 * qualityMultiplier;
      return total + estimatedCost;
    }, 0);
    
    costByTier[tier] = tierCost;
  }
  
  return {
    totalVideosGenerated: totalGenerated,
    totalCacheHits: cacheHits,
    estimatedCostSavings: estimatedSavings,
    costByTier
  };
}
