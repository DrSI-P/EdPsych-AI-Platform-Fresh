import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { aiService } from '@/lib/ai/ai-service';

// POST handler for generating an assessment using AI
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has permission to create assessments (admin, teacher, professional)
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    
    if (!isAdmin && !isTeacher && !isProfessional) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse request body
    const body = await request.json();
    const { prompt, subject, keyStage, questionCount, assessmentType, questionTypes } = body;
    
    // Validate required fields
    if (!subject || !keyStage || !questionTypes || questionTypes.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Construct the AI prompt
    let aiPrompt = `Create a ${assessmentType} assessment for ${keyStage} students on the subject of ${subject}. `;
    aiPrompt += `Include ${questionCount || 10} questions of the following types: ${questionTypes.join(', ')}. `;
    
    if (prompt) {
      aiPrompt += `Additional requirements: ${prompt}. `;
    }
    
    aiPrompt += `The response should be in JSON format with the following structure:
    {
      "title": "Assessment title",
      "description": "Brief description of the assessment",
      "subject": "${subject}",
      "keyStage": "${keyStage}",
      "type": "${assessmentType}",
      "passingScore": 70,
      "questions": [
        {
          "type": "multiple-choice",
          "content": "Question text",
          "points": 10,
          "options": [
            { "text": "Option 1", "isCorrect": false },
            { "text": "Option 2", "isCorrect": true },
            { "text": "Option 3", "isCorrect": false },
            { "text": "Option 4", "isCorrect": false }
          ]
        },
        {
          "type": "open-ended",
          "content": "Question text",
          "points": 20,
          "answer": "Expected answer or grading guidance"
        },
        {
          "type": "matching",
          "content": "Match the following items",
          "points": 15,
          "pairs": [
            { "left": "Item 1", "right": "Match 1" },
            { "left": "Item 2", "right": "Match 2" },
            { "left": "Item 3", "right": "Match 3" }
          ]
        }
      ]
    }
    
    Ensure all content follows UK spelling and educational standards. Make the assessment appropriate for ${keyStage} students.`;
    
    // Call the AI service to generate the assessment
    const aiResponse = await aiService.generateText(aiPrompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });
    
    // Parse the AI response
    let assessment;
    try {
      assessment = JSON.parse(aiResponse.text);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }
    
    // Validate the assessment structure
    if (!assessment.title || !assessment.questions || !Array.isArray(assessment.questions)) {
      return NextResponse.json(
        { error: 'Invalid assessment structure returned by AI' },
        { status: 500 }
      );
    }
    
    // Add order to questions
    assessment.questions = assessment.questions.map((question, index: number) => ({
      ...question,
      order: index
    }));
    
    // Return the generated assessment
    return NextResponse.json(assessment);
    
  } catch (error) {
    console.error('Error generating assessment:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the assessment' },
      { status: 500 }
    );
  }
}
