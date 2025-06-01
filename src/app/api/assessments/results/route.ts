import { NextResponse } from 'next/server';
import { 
  AssessmentResult,
  ProficiencyLevel
} from '@/lib/learning-path/types';

/**
 * API route handler for fetching assessment results
 * 
 * This endpoint retrieves assessment results for a specific user,
 * optionally filtered by subject.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const subjectId = searchParams.get('subjectId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would fetch assessment results from the database
    // For now, we'll create mock results
    const mockResults: AssessmentResult[] = [
      {
        id: 'assessment-1',
        userId,
        subjectId: 'maths',
        topicId: 'topic-1',
        score: 85,
        proficiencyLevel: ProficiencyLevel.SECURE,
        completedAt: new Date('2025-05-20'),
        timeSpent: 1200,
        attemptsCount: 1,
        correctAnswers: 17,
        totalQuestions: 20
      },
      {
        id: 'assessment-2',
        userId,
        subjectId: 'english',
        topicId: 'topic-4',
        score: 72,
        proficiencyLevel: ProficiencyLevel.DEVELOPING,
        completedAt: new Date('2025-05-15'),
        timeSpent: 1500,
        attemptsCount: 1,
        correctAnswers: 18,
        totalQuestions: 25
      }
    ];
    
    // Filter by subject if provided
    const filteredResults = subjectId 
      ? mockResults.filter(result => result.subjectId === subjectId)
      : mockResults;
    
    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment results' },
      { status: 500 }
    );
  }
}

/**
 * API route handler for submitting assessment results
 * 
 * This endpoint saves a new assessment result.
 */
export async function POST(request: Request) {
  try {
    const result = await request.json() as AssessmentResult;
    
    // Validate required fields
    if (!result.userId || !result.subjectId || !result.score) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, subjectId, and score are required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would save the assessment result to the database
    // For now, we'll just return the result with an ID
    
    const savedResult: AssessmentResult = {
      ...result,
      id: result.id || `assessment-${Date.now()}`,
      completedAt: result.completedAt || new Date()
    };
    
    return NextResponse.json(savedResult);
  } catch (error) {
    console.error('Error submitting assessment result:', error);
    return NextResponse.json(
      { error: 'Failed to submit assessment result' },
      { status: 500 }
    );
  }
}
