import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, prisma } from '@/lib/db';

// Schema for pattern analysis request
const PatternAnalysisRequestSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  emotions: z.array(z.string()).optional(),
  analysisType: z.enum(['all', 'triggers', 'time', 'trends', 'correlations']).optional()
});

// GET handler for retrieving emotion history and patterns
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const emotions = searchParams.get('emotions')?.split(',');
    const analysisType = searchParams.get('analysisType') || 'all';
    
    // Validate parameters
    const validationResult = PatternAnalysisRequestSchema.safeParse({
      startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate || new Date().toISOString(),
      emotions: emotions || [],
      analysisType
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const params = validationResult.data;
    
    // Fetch emotion records from database
    const emotionRecords = await (prisma as any).emotionRecord.findMany({
      where: {
        userId: session.user.id,
        timestamp: {
          gte: new Date(params.startDate),
          lte: new Date(params.endDate)
        },
        ...(params.emotions && params.emotions.length > 0 && !params.emotions.includes('all')
          ? { emotion: { in: params.emotions } }
          : {})
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    // Fetch emotion journals for the same period
    const emotionJournals = await (prisma as any).emotionJournal.findMany({
      where: {
        userId: session.user.id,
        timestamp: {
          gte: new Date(params.startDate),
          lte: new Date(params.endDate)
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    // Generate pattern analysis based on the data
    const patternAnalysis = generatePatternAnalysis(emotionRecords, emotionJournals, params.analysisType || 'all');
    
    return NextResponse.json({
      emotionRecords,
      emotionJournals,
      patternAnalysis
    });
    
  } catch (error) {
    console.error('Error in pattern recognition API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Function to generate pattern analysis from emotion data
function generatePatternAnalysis(emotionRecords: any[], emotionJournals: any[], analysisType: string = 'all') {
  // Initialize analysis object
  const analysis = {
    insights: [] as Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      [key: string]: any;
    }>,
    triggerPatterns: [] as Array<{
      trigger: string;
      total: number;
      [key: string]: any;
    }>,
    timePatterns: { hourly: [] as Array<{hour: number, count: number}>, daily: [] as Array<{day: number, name: string, count: number}> },
    emotionTrends: [] as Array<{date: string, [key: string]: any}>,
    emotionCorrelations: [] as Array<{source: string, target: string, count: number, strength: number}>
  };
  
  if (emotionRecords.length === 0) {
    return analysis;
  }
  
  // Generate insights
  if (analysisType === 'all' || analysisType === 'insights') {
    analysis.insights = generateInsights(emotionRecords);
  }
  
  // Generate trigger patterns
  if (analysisType === 'all' || analysisType === 'triggers') {
    analysis.triggerPatterns = generateTriggerPatterns(emotionRecords);
  }
  
  // Generate time patterns
  if (analysisType === 'all' || analysisType === 'time') {
    analysis.timePatterns = generateTimePatterns(emotionRecords);
  }
  
  // Generate emotion trends
  if (analysisType === 'all' || analysisType === 'trends') {
    analysis.emotionTrends = generateEmotionTrends(emotionRecords);
  }
  
  // Generate emotion correlations
  if (analysisType === 'all' || analysisType === 'correlations') {
    analysis.emotionCorrelations = generateEmotionCorrelations(emotionRecords);
  }
  
  return analysis;
}

// Helper function to generate insights
function generateInsights(emotionRecords: any[]) {
  const insights = [];
  
  // Most common emotion
  const emotionCounts: Record<string, number> = {};
  emotionRecords.forEach(record => {
    emotionCounts[record.emotion] = (emotionCounts[record.emotion] || 0) + 1;
  });
  
  const mostCommonEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  if (mostCommonEmotion) {
    insights.push({
      id: "most-common-emotion",
      type: "frequency",
      title: "Most Common Emotion",
      description: `Your most frequently recorded emotion is ${mostCommonEmotion[0]} (${mostCommonEmotion[1]} times).`,
      emotion: mostCommonEmotion[0],
      count: mostCommonEmotion[1]
    });
  }
  
  // Highest intensity emotion
  const emotionIntensities: Record<string, number[]> = {};
  emotionRecords.forEach(record => {
    if (!emotionIntensities[record.emotion]) {
      emotionIntensities[record.emotion] = [];
    }
    emotionIntensities[record.emotion].push(record.intensity);
  });
  
  const averageIntensities = Object.entries(emotionIntensities).map(([emotion, intensities]) => {
    const average = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
    return { emotion, average };
  });
  
  const highestIntensityEmotion = averageIntensities
    .sort((a, b) => b.average - a.average)[0];
  
  if (highestIntensityEmotion) {
    insights.push({
      id: "highest-intensity-emotion",
      type: "intensity",
      title: "Highest Intensity Emotion",
      description: `${highestIntensityEmotion.emotion} tends to be your most intense emotion (average intensity: ${highestIntensityEmotion.average.toFixed(1)}).`,
      emotion: highestIntensityEmotion.emotion,
      intensity: highestIntensityEmotion.average
    });
  }
  
  // Time-based patterns
  const timeOfDayCounts = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  };
  
  emotionRecords.forEach(record => {
    const hour = new Date(record.timestamp).getHours();
    if (hour >= 5 && hour < 12) timeOfDayCounts.morning++;
    else if (hour >= 12 && hour < 17) timeOfDayCounts.afternoon++;
    else if (hour >= 17 && hour < 22) timeOfDayCounts.evening++;
    else timeOfDayCounts.night++;
  });
  
  const mostCommonTimeOfDay = Object.entries(timeOfDayCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  if (mostCommonTimeOfDay && mostCommonTimeOfDay[1] > 0) {
    insights.push({
      id: "common-time-of-day",
      type: "time",
      title: "Time Pattern",
      description: `You tend to record emotions most often during the ${mostCommonTimeOfDay[0]} (${mostCommonTimeOfDay[1]} entries).`,
      timeOfDay: mostCommonTimeOfDay[0],
      count: mostCommonTimeOfDay[1]
    });
  }
  
  // Day of week patterns
  const dayOfWeekCounts: Record<string, number> = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0
  };
  
  emotionRecords.forEach(record => {
    const day = new Date(record.timestamp).toLocaleString('en-US', { weekday: 'long' });
    dayOfWeekCounts[day]++;
  });
  
  const mostCommonDayOfWeek = Object.entries(dayOfWeekCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  if (mostCommonDayOfWeek && mostCommonDayOfWeek[1] > 0) {
    insights.push({
      id: "common-day-of-week",
      type: "day",
      title: "Day of Week Pattern",
      description: `${mostCommonDayOfWeek[0]} is when you tend to record emotions most frequently (${mostCommonDayOfWeek[1]} entries).`,
      dayOfWeek: mostCommonDayOfWeek[0],
      count: mostCommonDayOfWeek[1]
    });
  }
  
  // Common triggers
  const triggerCounts: Record<string, number> = {};
  emotionRecords.forEach(record => {
    if (record.triggers) {
      const triggers = typeof record.triggers === 'string' 
        ? record.triggers 
        : JSON.stringify(record.triggers);
      
      triggerCounts[triggers] = (triggerCounts[triggers] || 0) + 1;
    }
  });
  
  const mostCommonTrigger = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  if (mostCommonTrigger && mostCommonTrigger[1] > 1) {
    insights.push({
      id: "common-trigger",
      type: "trigger",
      title: "Common Trigger",
      description: `"${mostCommonTrigger[0]}" is a frequent trigger for your emotions (${mostCommonTrigger[1]} times).`,
      trigger: mostCommonTrigger[0],
      count: mostCommonTrigger[1]
    });
  }
  
  // Emotion improvement suggestions
  if (mostCommonEmotion && ["Anxious", "Angry", "Sad", "Frustrated", "Overwhelmed"].includes(mostCommonEmotion[0])) {
    let suggestion = "";
    
    if (mostCommonEmotion[0] === "Anxious") {
      suggestion = "Consider practicing mindfulness or deep breathing exercises when you notice anxiety building.";
    } else if (mostCommonEmotion[0] === "Angry" || mostCommonEmotion[0] === "Frustrated") {
      suggestion = "Taking a short break or using the 5-4-3-2-1 grounding technique might help when you feel anger rising.";
    } else if (mostCommonEmotion[0] === "Sad") {
      suggestion = "Connecting with friends or engaging in activities you enjoy might help improve your mood.";
    } else if (mostCommonEmotion[0] === "Overwhelmed") {
      suggestion = "Breaking tasks into smaller steps and focusing on one thing at a time might help reduce feeling overwhelmed.";
    }
    
    insights.push({
      id: "suggestion",
      type: "suggestion",
      title: "Helpful Suggestion",
      description: suggestion,
      emotion: mostCommonEmotion[0]
    });
  }
  
  return insights;
}

// Helper function to generate trigger patterns
function generateTriggerPatterns(emotionRecords: any[]) {
  // Group emotions by triggers
  const triggerEmotions: Record<string, Record<string, number>> = {};
  
  emotionRecords.forEach(record => {
    if (record.triggers) {
      const triggers = typeof record.triggers === 'string' 
        ? record.triggers 
        : JSON.stringify(record.triggers);
      
      if (!triggerEmotions[triggers]) {
        triggerEmotions[triggers] = {};
      }
      
      triggerEmotions[triggers][record.emotion] = (triggerEmotions[triggers][record.emotion] || 0) + 1;
    }
  });
  
  // Convert to format for visualisation
  const triggerPatternData = Object.entries(triggerEmotions).map(([trigger, emotions]) => {
    return {
      trigger,
      ...emotions,
      total: Object.values(emotions).reduce((sum, count) => sum + count, 0)
    };
  });
  
  // Sort by total occurrences
  triggerPatternData.sort((a, b) => b.total - a.total);
  
  return triggerPatternData.slice(0, 5); // Top 5 triggers
}

// Helper function to generate time patterns
function generateTimePatterns(emotionRecords: any[]) {
  // Group by hour of day
  const hourCounts = Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));
  
  emotionRecords.forEach(record => {
    const hour = new Date(record.timestamp).getHours();
    hourCounts[hour].count++;
  });
  
  // Group by day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeekCounts = Array(7).fill(0).map((_, i) => ({ 
    day: i, 
    name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
    count: 0 
  }));
  
  emotionRecords.forEach(record => {
    const day = new Date(record.timestamp).getDay();
    dayOfWeekCounts[day].count++;
  });
  
  return {
    hourly: hourCounts,
    daily: dayOfWeekCounts
  };
}

// Helper function to generate emotion trends
function generateEmotionTrends(emotionRecords: any[]) {
  // Group by date
  const dateEmotions: Record<string, Record<string, number>> = {};
  
  emotionRecords.forEach(record => {
    const date = new Date(record.timestamp).toISOString().split('T')[0];
    if (!dateEmotions[date]) {
      dateEmotions[date] = {};
    }
    dateEmotions[date][record.emotion] = (dateEmotions[date][record.emotion] || 0) + 1;
  });
  
  // Convert to array and sort by date
  const trendData = Object.entries(dateEmotions).map(([date, emotions]) => {
    return {
      date,
      ...emotions
    };
  });
  
  trendData.sort((a, b) => a.date.localeCompare(b.date));
  
  return trendData;
}

// Helper function to generate emotion correlations
function generateEmotionCorrelations(emotionRecords: any[]) {
  // Find emotions that often occur together or in sequence
  const emotionPairs: Record<string, { source: string; target: string; count: number; strength: number }> = {};
  
  // Get unique emotion names
  const allEmotionNames = Array.from(new Set(emotionRecords.map(record => record.emotion)));
  
  // Initialize all possible pairs
  allEmotionNames.forEach(emotion1 => {
    allEmotionNames.forEach(emotion2 => {
      if (emotion1 !== emotion2) {
        const pairKey = [emotion1, emotion2].sort().join('-');
        if (!emotionPairs[pairKey]) {
          emotionPairs[pairKey] = {
            source: emotion1,
            target: emotion2,
            count: 0,
            strength: 0
          };
        }
      }
    });
  });
  
  // Sort records by timestamp
  const sortedRecords = [...emotionRecords].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Look for emotions that occur within 24 hours of each other
  for (let i = 0; i < sortedRecords.length - 1; i++) {
    const currentEmotion = sortedRecords[i].emotion;
    const currentTime = new Date(sortedRecords[i].timestamp);
    
    // Look ahead up to 3 entries or 24 hours, whichever comes first
    for (let j = i + 1; j < Math.min(i + 4, sortedRecords.length); j++) {
      const nextEmotion = sortedRecords[j].emotion;
      const nextTime = new Date(sortedRecords[j].timestamp);
      
      // Check if within 24 hours
      const hoursDiff = (nextTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
      if (hoursDiff <= 24 && currentEmotion !== nextEmotion) {
        const pairKey = [currentEmotion, nextEmotion].sort().join('-');
        emotionPairs[pairKey].count++;
      }
    }
  }
  
  // Calculate strength based on count
  const maxCount = Math.max(...Object.values(emotionPairs).map(pair => pair.count), 1);
  
  Object.values(emotionPairs).forEach(pair => {
    pair.strength = pair.count / maxCount;
  });
  
  // Filter to only include pairs that occurred at least once
  const significantPairs = Object.values(emotionPairs)
    .filter(pair => pair.count > 0)
    .sort((a, b) => b.count - a.count);
  
  return significantPairs.slice(0, 10); // Top 10 correlations
}

// POST handler for saving pattern recognition settings
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
    
    // Save user preferences for pattern recognition
    await (prisma as any).emotionalRegulationSettings.update({
      where: {
        userId: session.user.id
      },
      data: {
        patternRecognitionEnabled: body.enabled ?? true,
        patternRecognitionSettings: body.settings ?? {}
      }
    });
    
    // Log the activity
    await (prisma as any).emotionalRegulationLog.create({
      data: {
        userId: session.user.id,
        action: 'update_pattern_recognition_settingstings',
        details: JSON.stringify(body)
      }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in pattern recognition API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
