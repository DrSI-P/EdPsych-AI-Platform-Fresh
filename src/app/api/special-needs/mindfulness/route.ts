import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Schema for mindfulness activity
const MindfulnessActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.number(),
  category: z.enum(['breathing', 'body-scan', 'visualisation', 'movement', 'sensory', 'compassion']),
  ageRange: z.enum(['all', 'primary', 'secondary']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  benefits: z.array(z.string()),
  audioSrc: z.string().optional(),
  imageSrc: z.string().optional(),
  transcript: z.string(),
  instructions: z.array(z.string()),
  evidenceBase: z.string()
});

// Schema for user preferences
const UserPreferencesSchema = z.object({
  preferredDuration: z.enum(['short', 'medium', 'long']),
  preferredThemes: z.array(z.string()),
  preferredVoice: z.enum(['female', 'male', 'no-preference']),
  reminderFrequency: z.enum(['daily', 'weekly', 'none']),
  backgroundSounds: z.boolean()
});

// Define types for activity log details
interface ActivityCompletionDetails {
  activityId: string;
  duration: number;
  completedAt: Date;
}

interface ActivityFeedbackDetails {
  activityId: string;
  feedback: {
    rating: number;
    notes: string;
  };
}

// Define type for activity history item
interface ActivityHistoryItem {
  id: string;
  activityId: string;
  completedAt: Date;
  duration: number;
  feedback: {
    rating: number;
    notes: string;
  } | null;
}

// GET handler for retrieving mindfulness activities
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const ageRange = searchParams.get('ageRange');
    const difficulty = searchParams.get('difficulty');
    const duration = searchParams.get('duration');
    
    // Fetch user settings
    const userSettings = await db.mindfulnessSettings.findUnique({
      where: {
        userId: session.user.id
      }
    });
    
    // Fetch activity history
    const activityHistory = await db.mindfulnessLog.findMany({
      where: {
        userId: session.user.id,
        action: 'complete_activity'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    // Fetch favourite activities
    const favoriteActivities = await db.mindfulnessSettings.findUnique({
      where: {
        userId: session.user.id
      },
      select: {
        favoriteActivities: true
      }
    });
    
    // In a real implementation, we would fetch activities from the database
    // For now, we'll return a placeholder response
    return NextResponse.json({
      activities: [] as z.infer<typeof MindfulnessActivitySchema>[], // Would be populated from database
      userPreferences: userSettings?.preferences || {
        preferredDuration: 'medium',
        preferredThemes: ['breathing', 'body-scan', 'visualisation'],
        preferredVoice: 'female',
        reminderFrequency: 'weekly',
        backgroundSounds: true
      },
      activityHistory: activityHistory.map(log => {
        const details = log.details as ActivityCompletionDetails;
        return {
          id: log.id,
          activityId: details?.activityId || '',
          completedAt: log.timestamp,
          duration: details?.duration || 0,
          feedback: null
        } as ActivityHistoryItem;
      }),
      favoriteActivities: favoriteActivities?.favoriteActivities || []
    });
    
  } catch (error) {
    // Using type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler for saving user preferences, activity feedback, and logging completions
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const action = body.action;
    
    switch (action) {
      case 'update_preferences': {
        // Validate preferences
        const validationResult = UserPreferencesSchema.safeParse(body.preferences);
        
        if (!validationResult.success) {
          return NextResponse.json(
            { error: 'Invalid preferences', details: validationResult.error.format() },
            { status: 400 }
          );
        }
        
        const preferences = validationResult.data;
        
        // Update user preferences
        await db.mindfulnessSettings.upsert({
          where: {
            userId: session.user.id
          },
          update: {
            preferences
          },
          create: {
            userId: session.user.id,
            preferences,
            favoriteActivities: []
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Preferences updated successfully'
        });
      }
      
      case 'toggle_favorite': {
        const activityId = body.activityId;
        
        if (!activityId) {
          return NextResponse.json(
            { error: 'Activity ID is required' },
            { status: 400 }
          );
        }
        
        // Get current favorites
        const userSettings = await db.mindfulnessSettings.findUnique({
          where: {
            userId: session.user.id
          },
          select: {
            favoriteActivities: true
          }
        });
        
        let favoriteActivities = userSettings?.favoriteActivities || [];
        
        // Toggle favourite status
        if (Array.isArray(favoriteActivities) && favoriteActivities.includes(activityId)) {
          favoriteActivities = favoriteActivities.filter(id => id !== activityId);
        } else {
          if (!Array.isArray(favoriteActivities)) {
            favoriteActivities = [];
          }
          favoriteActivities.push(activityId);
        }
        
        // Update user settings
        await db.mindfulnessSettings.upsert({
          where: {
            userId: session.user.id
          },
          update: {
            favoriteActivities
          },
          create: {
            userId: session.user.id,
            preferences: {
              preferredDuration: 'medium',
              preferredThemes: ['breathing', 'body-scan', 'visualisation'],
              preferredVoice: 'female',
              reminderFrequency: 'weekly',
              backgroundSounds: true
            },
            favoriteActivities
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Favourite status updated successfully',
          isFavorite: Array.isArray(userSettings?.favoriteActivities) ? !userSettings.favoriteActivities.includes(activityId) : false
        });
      }
      
      case 'log_completion': {
        const activityId = body.activityId;
        const duration = body.duration;
        
        if (!activityId || !duration) {
          return NextResponse.json(
            { error: 'Activity ID and duration are required' },
            { status: 400 }
          );
        }
        
        // Log activity completion
        await db.mindfulnessLog.create({
          data: {
            userId: session.user.id,
            action: 'complete_activity',
            details: {
              activityId,
              duration,
              completedAt: new Date()
            } as ActivityCompletionDetails,
            timestamp: new Date()
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Activity completion logged successfully'
        });
      }
      
      case 'submit_feedback': {
        const activityId = body.activityId;
        const rating = body.rating;
        const notes = body.notes;
        
        if (!activityId || !rating || rating < 1 || rating > 5) {
          return NextResponse.json(
            { error: 'Valid activity ID and rating (1-5) are required' },
            { status: 400 }
          );
        }
        
        // Log activity feedback
        await db.mindfulnessLog.create({
          data: {
            userId: session.user.id,
            action: 'activity_feedback',
            details: {
              activityId,
              feedback: {
                rating,
                notes: notes || ''
              }
            } as ActivityFeedbackDetails,
            timestamp: new Date()
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Feedback submitted successfully'
        });
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    // Using type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
