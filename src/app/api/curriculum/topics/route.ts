import { NextResponse } from 'next/server';

/**
 * API route handler for fetching curriculum topics
 * 
 * This endpoint retrieves curriculum topics for a specific subject and key stage.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const keyStage = searchParams.get('keyStage');
    
    if (!subjectId || !keyStage) {
      return NextResponse.json(
        { error: 'Missing required parameters: subjectId and keyStage' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would fetch topics from the database
    // For now, we'll create mock topics based on subject and key stage
    
    let mockTopics = [];
    
    if (subjectId === 'maths' && keyStage === 'ks2') {
      mockTopics = [
        { id: 'topic-1', name: 'Number and Place Value' },
        { id: 'topic-2', name: 'Addition and Subtraction' },
        { id: 'topic-3', name: 'Multiplication and Division' },
        { id: 'topic-4', name: 'Fractions' },
        { id: 'topic-5', name: 'Measurement' },
        { id: 'topic-6', name: 'Geometry - Properties of Shapes' },
        { id: 'topic-7', name: 'Geometry - Position and Direction' },
        { id: 'topic-8', name: 'Statistics' }
      ];
    } else if (subjectId === 'english' && keyStage === 'ks2') {
      mockTopics = [
        { id: 'topic-9', name: 'Reading - Word Reading' },
        { id: 'topic-10', name: 'Reading - Comprehension' },
        { id: 'topic-11', name: 'Writing - Transcription' },
        { id: 'topic-12', name: 'Writing - Composition' },
        { id: 'topic-13', name: 'Writing - Vocabulary, Grammar and Punctuation' },
        { id: 'topic-14', name: 'Spoken Language' }
      ];
    } else if (subjectId === 'science' && keyStage === 'ks2') {
      mockTopics = [
        { id: 'topic-15', name: 'Working Scientifically' },
        { id: 'topic-16', name: 'Plants' },
        { id: 'topic-17', name: 'Animals, including humans' },
        { id: 'topic-18', name: 'Rocks' },
        { id: 'topic-19', name: 'Light' },
        { id: 'topic-20', name: 'Forces and Magnets' },
        { id: 'topic-21', name: 'Living things and their habitats' },
        { id: 'topic-22', name: 'States of Matter' },
        { id: 'topic-23', name: 'Sound' },
        { id: 'topic-24', name: 'Electricity' },
        { id: 'topic-25', name: 'Earth and Space' },
        { id: 'topic-26', name: 'Evolution and Inheritance' }
      ];
    } else {
      // Default topics for other subjects/key stages
      mockTopics = [
        { id: `${subjectId}-topic-1`, name: 'Introduction' },
        { id: `${subjectId}-topic-2`, name: 'Core Concepts' },
        { id: `${subjectId}-topic-3`, name: 'Advanced Topics' }
      ];
    }
    
    return NextResponse.json(mockTopics);
  } catch (error) {
    console.error('Error fetching curriculum topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch curriculum topics' },
      { status: 500 }
    );
  }
}
