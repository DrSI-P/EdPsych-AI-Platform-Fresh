import { NextResponse } from 'next/server';
import { 
  UserLearningProfile,
  LearningStyle
} from '@/lib/learning-path/types';

/**
 * API route handler for fetching a user's learning profile
 * 
 * This endpoint retrieves the learning profile for a specific user.
 */
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would fetch the user's learning profile from the database
    // For now, we'll create a mock profile
    const mockProfile: UserLearningProfile = {
      id: `profile-${userId}`,
      userId,
      dominantLearningStyle: LearningStyle.VISUAL,
      secondaryLearningStyle: LearningStyle.KINESTHETIC,
      learningPace: 6,
      interests: ['technology', 'space', 'science_fiction', 'gaming'],
      strengths: ['topic-1', 'topic-5'],
      areasForImprovement: ['topic-3', 'topic-7'],
      preferredLearningTime: 'afternoon',
      focusDuration: 45,
      lastUpdated: new Date('2025-05-10')
    };
    
    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error('Error fetching user learning profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user learning profile' },
      { status: 500 }
    );
  }
}

/**
 * API route handler for updating a user's learning profile
 * 
 * This endpoint updates the learning profile for a specific user.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const updates = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would update the user's learning profile in the database
    // For now, we'll just return the updates
    
    // Mock the updated profile by combining the mock GET response with the updates
    const mockResponse = await GET(request, { params });
    const mockProfileData = await mockResponse.json();
    
    const updatedProfile = {
      ...mockProfileData,
      ...updates,
      lastUpdated: new Date()
    };
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user learning profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user learning profile' },
      { status: 500 }
    );
  }
}
