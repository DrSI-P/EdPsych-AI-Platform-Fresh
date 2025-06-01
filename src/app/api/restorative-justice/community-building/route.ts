import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Schema for activity filtering
const ActivityFilterSchema = z.object({
  category: z.string().optional(),
  ageGroup: z.string().optional(),
  timeRequired: z.string().optional(),
  groupSize: z.string().optional(),
  searchQuery: z.string().optional()
});

// Schema for favourite toggling
const FavoriteToggleSchema = z.object({
  activityId: z.string(),
  isFavorite: z.boolean()
});

// Define interfaces for request data
interface ActivityFilters {
  category?: string;
  ageGroups?: {
    has: string;
  };
  timeRequired?: string;
  groupSize?: string;
  OR?: Array<{
    title?: {
      contains: string;
      mode: string;
    };
    description?: {
      contains: string;
      mode: string;
    };
  }>;
}

// GET handler for retrieving activities
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const ageGroup = searchParams.get('ageGroup');
    const timeRequired = searchParams.get('timeRequired');
    const groupSize = searchParams.get('groupSize');
    const searchQuery = searchParams.get('searchQuery');
    
    // Validate filters
    const validatedFilters = ActivityFilterSchema.parse({
      category,
      ageGroup,
      timeRequired,
      groupSize,
      searchQuery
    });
    
    // Build query filters
    const filters: ActivityFilters = {};
    
    if (validatedFilters.category && validatedFilters.category !== 'all') {
      filters.category = validatedFilters.category;
    }
    
    if (validatedFilters.ageGroup && validatedFilters.ageGroup !== 'all') {
      filters.ageGroups = {
        has: validatedFilters.ageGroup
      };
    }
    
    if (validatedFilters.timeRequired && validatedFilters.timeRequired !== 'all') {
      filters.timeRequired = validatedFilters.timeRequired;
    }
    
    if (validatedFilters.groupSize && validatedFilters.groupSize !== 'all') {
      filters.groupSize = validatedFilters.groupSize;
    }
    
    if (validatedFilters.searchQuery) {
      filters.OR = [
        {
          title: {
            contains: validatedFilters.searchQuery,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: validatedFilters.searchQuery,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    // Fetch activities from database
    const activities = await prisma.communityBuildingActivity.findMany({
      where: filters,
      orderBy: {
        rating: 'desc'
      }
    });
    
    // Fetch user favorites
    const favorites = await prisma.activityFavorite.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        activityId: true
      }
    });
    
    const favoriteIds = favorites.map(fav => fav.activityId);
    
    // Add isFavorite flag to activities
    const activitiesWithFavorites = activities.map(activity => ({
      ...activity,
      isFavorite: favoriteIds.includes(activity.id)
    }));
    
    return NextResponse.json(activitiesWithFavorites);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

// POST handler for toggling favorites
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const validatedData = FavoriteToggleSchema.parse(body);
    
    if (validatedData.isFavorite) {
      // Add to favorites
      await prisma.activityFavorite.create({
        data: {
          user: {
            connect: {
              id: session.user.id
            }
          },
          activity: {
            connect: {
              id: validatedData.activityId
            }
          }
        }
      });
    } else {
      // Remove from favorites
      await prisma.activityFavorite.deleteMany({
        where: {
          userId: session.user.id,
          activityId: validatedData.activityId
        }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error('Error toggling favourite:', error);
    return NextResponse.json({ error: 'Failed to update favourite status' }, { status: 500 });
  }
}
