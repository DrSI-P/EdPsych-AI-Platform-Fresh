import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Schema for emotion vocabulary preferences
const PreferencesSchema = z.object({
  voiceEnabled: z.boolean().default(true),
  animationsEnabled: z.boolean().default(true),
  simplifiedView: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  textSize: z.enum(['small', 'medium', 'large', 'x-large']).default('medium'),
});

// Schema for emotion vocabulary progress
const ProgressSchema = z.object({
  emotionId: z.string(),
  activityType: z.enum(['explored', 'learned', 'practiced', 'mastered']),
  notes: z.string().optional(),
});

// GET handler for retrieving vocabulary data
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const ageGroup = searchParams.get('ageGroup');
    const category = searchParams.get('category');
    const intensity = searchParams.get('intensity');
    
    // Fetch user preferences
    const userPreferences = await (prisma as any).emotionalVocabularyPreferences.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    
    // Fetch user progress
    const userProgress = await (prisma as any).emotionalVocabularyProgress.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    // Fetch emotions based on filters
    const emotions = await (prisma as any).emotion.findMany({
      where: {
        ...(ageGroup && ageGroup !== 'all' ? { ageGroups: { has: ageGroup } } : {}),
        ...(category && category !== 'all' ? { category } : {}),
        ...(intensity && intensity !== 'all' ? { intensity } : {}),
      },
      include: {
        synonyms: true,
        examples: true,
        triggers: true,
        expressions: true,
        strategies: true,
        relatedEmotions: true,
      },
    });
    
    // Fetch activities based on filters
    const activities = await (prisma as any).emotionalVocabularyActivity.findMany({
      where: {
        ...(ageGroup && ageGroup !== 'all' ? { ageGroups: { has: ageGroup } } : {}),
        ...(category && category !== 'all' ? { 
          OR: [
            { emotionCategories: { has: category } },
            { emotionCategories: { has: 'all' } },
          ],
        } : {}),
      },
    });
    
    // Fetch quizzes based on filters
    const quizzes = await (prisma as any).emotionalVocabularyQuiz.findMany({
      where: {
        ...(ageGroup && ageGroup !== 'all' ? { ageGroups: { has: ageGroup } } : {}),
      },
      include: {
        questions: true,
      },
    });
    
    // Fetch resources based on filters
    const resources = await (prisma as any).emotionalVocabularyResource.findMany({
      where: {
        ...(ageGroup && ageGroup !== 'all' ? { ageGroups: { has: ageGroup } } : {}),
      },
    });
    
    // Determine what data to return based on type parameter
    let responseData = {};
    
    switch (type) {
      case 'emotions':
        responseData = { emotions };
        break;
      case 'activities':
        responseData = { activities };
        break;
      case 'quizzes':
        responseData = { quizzes };
        break;
      case 'resources':
        responseData = { resources };
        break;
      case 'preferences':
        responseData = { preferences: userPreferences };
        break;
      case 'progress':
        responseData = { progress: userProgress };
        break;
      default:
        // Return all data if no specific type is requested
        responseData = {
          emotions,
          activities,
          quizzes,
          resources,
          preferences: userPreferences,
          progress: userProgress,
        };
    }
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Error in emotional vocabulary API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler for updating preferences or recording progress
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { type } = body;
    
    if (type === 'preferences') {
      // Validate preferences data
      const preferences = PreferencesSchema.parse(body.preferences);
      
      // Update or create user preferences
      const updatedPreferences = await (prisma as any).emotionalVocabularyPreferences.upsert({
        where: {
          userId: session.user.id,
        },
        update: preferences,
        create: {
          userId: session.user.id,
          ...preferences,
        },
      });
      
      return NextResponse.json({ preferences: updatedPreferences });
    }
    
    if (type === 'progress') {
      // Validate progress data
      const progress = ProgressSchema.parse(body.progress);
      
      // Record user progress
      const newProgress = await (prisma as any).emotionalVocabularyProgress.create({
        data: {
          userId: session.user.id,
          emotionId: progress.emotionId,
          activityType: progress.activityType,
          notes: progress.notes || '',
        },
      });
      
      return NextResponse.json({ progress: newProgress });
    }
    
    // If type is not recognised
    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error in emotional vocabulary API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
