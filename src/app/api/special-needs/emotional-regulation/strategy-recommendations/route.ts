import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, prisma } from '@/lib/db';

// Schema for strategy recommendations request
const StrategyRecommendationsRequestSchema = z.object({
  emotionName: z.string().optional(),
  preferredCategories: z.array(z.string()).optional(),
  complexity: z.enum(['simple', 'moderate', 'advanced']).optional(),
  limit: z.number().min(1).max(20).optional()
});

// Schema for strategy feedback
const StrategyFeedbackSchema = z.object({
  strategyId: z.string(),
  effectiveness: z.number().min(1).max(5),
  notes: z.string().optional(),
  emotion: z.string().optional()
});

// Schema for user preferences
const UserPreferencesSchema = z.object({
  preferredStrategyTypes: z.array(z.string()),
  strategyComplexity: z.enum(['simple', 'moderate', 'advanced']),
  reminderFrequency: z.enum(['low', 'medium', 'high']),
  autoSuggestEnabled: z.boolean(),
  favoriteStrategies: z.array(z.string())
});

// GET handler for retrieving personalized strategy recommendations
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
    const emotionName = searchParams.get('emotion');
    const preferredCategories = searchParams.get('categories')?.split(',');
    const complexity = searchParams.get('complexity') as 'simple' | 'moderate' | 'advanced' | undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    
    // Validate parameters
    const validationResult = StrategyRecommendationsRequestSchema.safeParse({
      emotionName,
      preferredCategories,
      complexity,
      limit
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const params = validationResult.data;
    
    // Fetch user settings
    const userSettings = await (prisma as any).emotionalRegulationSettings.findUnique({
      where: {
        userId: session.user.id
      }
    });
    
    if (!userSettings) {
      return NextResponse.json(
        { error: 'User settings not found' },
        { status: 404 }
      );
    }
    
    // Fetch emotion records for pattern analysis
    const emotionRecords = await (prisma as any).emotionRecord.findMany({
      where: {
        userId: session.user.id,
        timestamp: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    // Fetch strategy usage history
    const strategyHistory = await (prisma as any).emotionalRegulationLog.findMany({
      where: {
        userId: session.user.id,
        action: 'strategy_feedback'
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    // Generate personalized recommendations
    const recommendations = generatePersonalizedRecommendations(
      emotionRecords,
      strategyHistory,
      userSettings,
      params
    );
    
    return NextResponse.json({
      recommendations,
      userPreferences: {
        preferredStrategyTypes: userSettings.strategyPreferences?.preferredTypes || ['physical', 'cognitive', 'social'],
        strategyComplexity: userSettings.strategyPreferences?.complexity || 'moderate',
        reminderFrequency: userSettings.reminderFrequency || 'medium',
        autoSuggestEnabled: userSettings.strategyPreferences?.autoSuggest || true,
        favoriteStrategies: userSettings.strategyPreferences?.favorites || []
      }
    });
    
  } catch (error) {
    console.error('Error in strategy recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler for saving strategy feedback
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
    
    // Check if this is a preferences update or strategy feedback
    if (body.action === 'update_preferences') {
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
      await (prisma as any).emotionalRegulationSettings.update({
        where: {
          userId: session.user.id
        },
        data: {
          strategyPreferences: {
            preferredTypes: preferences.preferredStrategyTypes,
            complexity: preferences.strategyComplexity,
            autoSuggest: preferences.autoSuggestEnabled,
            favorites: preferences.favoriteStrategies
          },
          reminderFrequency: preferences.reminderFrequency
        }
      });
      
      // Log the activity
      await (prisma as any).emotionalRegulationLog.create({
        data: {
          userId: session.user.id,
          action: 'update_strategy_preferences',
          details: preferences,
          timestamp: new Date()
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Preferences updated successfully'
      });
      
    } else {
      // This is strategy feedback
      // Validate feedback
      const validationResult = StrategyFeedbackSchema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid feedback', details: validationResult.error.format() },
          { status: 400 }
        );
      }
      
      const feedback = validationResult.data;
      
      // Log the strategy feedback
      await (prisma as any).emotionalRegulationLog.create({
        data: {
          userId: session.user.id,
          action: 'strategy_feedback',
          details: {
            strategyId: feedback.strategyId,
            effectiveness: feedback.effectiveness,
            notes: feedback.notes || '',
            emotion: feedback.emotion || 'Unknown'
          },
          timestamp: new Date()
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Strategy feedback recorded successfully'
      });
    }
    
  } catch (error) {
    console.error('Error in strategy recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate personalized recommendations
function generatePersonalizedRecommendations(emotionRecords: any[], strategyHistory: any[], userSettings: any, params: any) {
  // This would be replaced with actual recommendation logic in production
  // For now, we'll return a placeholder response
  
  // Define a set of regulation strategies
  const regulationStrategies = [
    {
      id: "deep-breathing",
      name: "Deep Breathing",
      description: "Take slow, deep breaths to calm your body and mind.",
      steps: [
        "Find a comfortable position",
        "Breathe in slowly through your nose for 4 counts",
        "Hold your breath for 2 counts",
        "Breathe out slowly through your mouth for 6 counts",
        "Repeat 5 times"
      ],
      suitableFor: ["Angry", "Anxious", "Overwhelmed", "Nervous"],
      category: "physical",
      complexity: "simple",
      duration: "short",
      evidenceBase: "Supported by research from the British Psychological Society and NHS mental health guidelines."
    },
    {
      id: "counting",
      name: "Counting",
      description: "Count slowly to help redirect your focus and calm down.",
      steps: [
        "Start counting slowly from 1",
        "Focus on each number as you say it",
        "Continue to 10 or 20",
        "If needed, count backwards to 1"
      ],
      suitableFor: ["Angry", "Frustrated", "Overwhelmed"],
      category: "cognitive",
      complexity: "simple",
      duration: "short",
      evidenceBase: "Recommended by the Royal College of Psychiatrists as a grounding technique."
    },
    {
      id: "visualisation",
      name: "Peaceful Place Visualisation",
      description: "Imagine a calm, peaceful place to help you relax.",
      steps: [
        "Close your eyes",
        "Think of a place where you feel safe and calm",
        "Imagine what you can see there",
        "Imagine what you can hear there",
        "Imagine what you can feel there",
        "Stay in this place for a few minutes"
      ],
      suitableFor: ["Anxious", "Scared", "Overwhelmed", "Sad"],
      category: "cognitive",
      complexity: "moderate",
      duration: "medium",
      evidenceBase: "Supported by cognitive-behavioural therapy research and NICE guidelines for anxiety management."
    },
    // Additional strategies would be defined here
  ];
  
  // Step 1: Analyse emotion patterns
  const emotionFrequency: Record<string, number> = {};
  emotionRecords.forEach(record => {
    emotionFrequency[record.emotion] = (emotionFrequency[record.emotion] || 0) + 1;
  });
  
  const commonEmotions = Object.entries(emotionFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);
  
  // Step 2: Analyse strategy effectiveness
  const strategyEffectiveness: Record<string, { totalRating: number; count: number; average: number }> = {};
  strategyHistory.forEach(record => {
    if (record.details?.strategyId) {
      const strategyId = record.details?.strategyId;
      if (!strategyEffectiveness[strategyId]) {
        strategyEffectiveness[strategyId] = {
          totalRating: 0,
          count: 0,
          average: 0
        };
      }
      strategyEffectiveness[strategyId].totalRating += record.details?.effectiveness || 0;
      strategyEffectiveness[strategyId].count += 1;
      strategyEffectiveness[strategyId].average = 
        strategyEffectiveness[strategyId].totalRating / strategyEffectiveness[strategyId].count;
    }
  });
  
  const effectiveStrategies = Object.entries(strategyEffectiveness)
    .filter(([_, data]) => data.average >= 3.5 && data.count >= 2)
    .map(([id, _]) => id);
  
  // Step 3: Filter strategies based on user preferences
  const preferredTypes = userSettings.strategyPreferences?.preferredTypes || ['physical', 'cognitive', 'social'];
  const preferredComplexity = userSettings.strategyPreferences?.complexity || 'moderate';
  
  const filteredStrategies = regulationStrategies.filter(strategy => {
    // Match by category preference
    const categoryMatch = preferredTypes.includes(strategy.category);
    
    // Match by complexity
    let complexityMatch = true;
    if (preferredComplexity === "simple") {
      complexityMatch = strategy.complexity === "simple";
    } else if (preferredComplexity === "moderate") {
      complexityMatch = strategy.complexity !== "advanced";
    }
    
    // Match by current emotion if specified
    let emotionMatch = true;
    if (params.emotionName) {
      emotionMatch = strategy.suitableFor.includes(params.emotionName);
    }
    
    return categoryMatch && complexityMatch && emotionMatch;
  });
  
  // Step 4: Generate personalized recommendations
  const recommendations: Array<{
    id: string;
    title: string;
    description: string;
    steps: any[];
    category: string;
    suitability: number;
    timeRequired: string;
    reason?: string;
    reasonType?: string;
    score?: number;
  }> = [];
  
  // 4.1: Add strategies that have worked well in the past
  effectiveStrategies.forEach(strategyId => {
    const strategy = regulationStrategies.find(s => s.id === strategyId);
    if (strategy && filteredStrategies.some(s => s.id === strategyId)) {
      recommendations.push({
        id: strategy.id,
        title: strategy.name,
        description: strategy.description,
        steps: strategy.steps,
        category: strategy.category,
        suitability: 90,
        timeRequired: strategy.duration === 'short' ? '5 minutes' : (strategy.duration === 'medium' ? '15 minutes' : '30 minutes'),
        reason: "This has worked well for you in the past",
        reasonType: "effectiveness",
        score: strategyEffectiveness[strategyId].average * 20 // Convert to 0-100 scale
      });
    }
  });
  
  // 4.2: Add strategies suitable for common emotions
  commonEmotions.forEach(emotion => {
    const suitableStrategies = filteredStrategies.filter(
      strategy => strategy.suitableFor.includes(emotion) && 
      !recommendations.some(r => r.id === strategy.id)
    );
    
    suitableStrategies.slice(0, 2).forEach(strategy => {
      recommendations.push({
        id: strategy.id,
        title: strategy.name,
        description: strategy.description,
        steps: strategy.steps,
        category: strategy.category,
        suitability: 85,
        timeRequired: strategy.duration === 'short' ? '5 minutes' : (strategy.duration === 'medium' ? '15 minutes' : '30 minutes'),
        reason: `Good for managing ${emotion.toLowerCase()} feelings`,
        reasonType: "emotion",
        score: 70 + Math.random() * 15 // Random score between 70-85
      });
    });
  });
  
  // 4.3: Add some strategies based on evidence strength
  const evidenceBasedStrategies = filteredStrategies
    .filter(strategy => 
      !recommendations.some(r => r.id === strategy.id) &&
      (strategy.evidenceBase.includes("NICE") || 
      strategy.evidenceBase.includes("NHS") ||
      strategy.evidenceBase.includes("research"))
    )
    .slice(0, 2);
  
  evidenceBasedStrategies.forEach(strategy => {
    recommendations.push({
      id: strategy.id,
      title: strategy.name,
      description: strategy.description,
      steps: strategy.steps,
      category: strategy.category,
      suitability: 80,
      timeRequired: strategy.duration === 'short' ? '5 minutes' : (strategy.duration === 'medium' ? '15 minutes' : '30 minutes'),
      reason: "Strong evidence supporting effectiveness",
      reasonType: "evidence",
      score: 65 + Math.random() * 15 // Random score between 65-80
    });
  });
  
  // 4.4: Add some variety if needed
  if (recommendations.length < params.limit) {
    const remainingStrategies = filteredStrategies
      .filter(strategy => !recommendations.some(r => r.id === strategy.id))
      .slice(0, params.limit - recommendations.length);
    
    remainingStrategies.forEach(strategy => {
      recommendations.push({
        id: strategy.id,
        title: strategy.name,
        description: strategy.description,
        steps: strategy.steps,
        category: strategy.category,
        suitability: 75,
        timeRequired: strategy.duration === 'short' ? '5 minutes' : (strategy.duration === 'medium' ? '15 minutes' : '30 minutes'),
        reason: "Matches your preferences",
        reasonType: "preference",
        score: 60 + Math.random() * 10 // Random score between 60-70
      });
    });
  }
  
  // Sort by score
  recommendations.sort((a, b) => (b.score || 0) - (a.score || 0));
  
  // Limit to requested number
  return recommendations.slice(0, params.limit);
}
