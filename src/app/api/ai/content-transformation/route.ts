import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import { getAIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { 
      originalContent, 
      contentType = 'lesson', 
      subjectArea = '', 
      targetAge = 10,
      complexity = 50,
      learningStylePreference = null
    } = data;
    
    if (!originalContent) {
      return NextResponse.json({ error: 'No content provided for transformation' }, { status: 400 });
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Get user's learning style profile if available and no preference specified
    let userLearningStyle = null;
    if (!learningStylePreference) {
      try {
        const learningStyle = await prisma.learningStyle.findFirst({
          where: {
            userId: session.user.id
          },
          orderBy: {
            updatedAt: 'desc'
          }
        });
        
        if (learningStyle) {
          // Determine primary style based on highest score
          const scores = {
            visual: learningStyle.visual,
            auditory: learningStyle.auditory,
            readWrite: learningStyle.readWrite,
            kinesthetic: learningStyle.kinesthetic
          };
          
          const primaryStyle = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
          userLearningStyle = primaryStyle.toLowerCase();
        }
      } catch (error) {
        console.log('Learning style not found:', error);
        // Continue without learning style
      }
    }
    
    // Create prompt for content transformation
    const prompt = `
      Transform the following educational content to optimise it for different learning styles.
      Create versions optimised for visual, auditory, kinesthetic, and reading/writing learning styles,
      as well as a multimodal version that combines elements from all styles.
      
      Content Type: ${contentType}
      ${subjectArea ? `Subject Area: ${subjectArea}` : ''}
      Target Age: ${targetAge}
      Complexity Level (0-100): ${complexity}
      ${userLearningStyle || learningStylePreference ? `User's Learning Style Preference: ${userLearningStyle || learningStylePreference}` : ''}
      
      Original Content:
      ${originalContent}
      
      For each learning style, adapt the content while preserving the educational objectives:
      
      1. Visual: Emphasize diagrams, charts, colour-coding, spatial organisation, and visual metaphors.
      2. Auditory: Emphasize dialogue, discussion points, mnemonics, rhythm, and spoken explanations.
      3. Kinesthetic: Emphasize hands-on activities, physical movements, tactile examples, and experiential learning.
      4. Reading/Writing: Emphasize lists, definitions, structured text, note-taking opportunities, and written exercises.
      5. Multimodal: Create a balanced version that incorporates elements from all learning styles.
      
      Ensure all content:
      - Uses UK English spelling and terminology
      - Aligns with UK curriculum standards
      - Is evidence-based and factually accurate
      - Is age-appropriate for the target audience
      - Maintains the educational integrity of the original content
      
      Format the response as JSON with the following structure:
      {
        "visual": "content optimised for visual learners",
        "auditory": "content optimised for auditory learners",
        "kinesthetic": "content optimised for kinesthetic learners",
        "readingWriting": "content optimised for reading/writing learners",
        "multimodal": "content optimised for multimodal learning"
      }
    `;
    
    // Call AI service for transformation
    const aiResponse = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2500,
      responseFormat: { type: 'json_object' }
    });
    
    // Parse AI response
    let transformedContent;
    try {
      // Extract text from AI response object
      const responseText = aiResponse.text;
      transformedContent = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return NextResponse.json({ error: 'Failed to transform content' }, { status: 500 });
    }
    
    // Save transformation to database
    let contentTransformation;
    try {
      contentTransformation = await prisma.contentTransformation.create({
        data: {
          userId: session.user.id,
          originalContent,
          contentType,
          subjectArea: subjectArea || null,
          targetAge,
          complexity,
          learningStylePreference: learningStylePreference || userLearningStyle || null,
          visualContent: transformedContent.visual,
          auditoryContent: transformedContent.auditory,
          kinestheticContent: transformedContent.kinesthetic,
          readingWritingContent: transformedContent.readingWriting,
          multimodalContent: transformedContent.multimodal
        }
      });
    } catch (error) {
      console.log('Failed to save content transformation to database:', error);
      // Continue without saving to database
    }
    
    return NextResponse.json({
      success: true,
      transformedContent,
      transformationId: contentTransformation?.id
    });
    
  } catch (error) {
    console.error('Error in content transformation:', error);
    return NextResponse.json({ error: 'Failed to process content transformation' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const transformationId = url.searchParams.get('id');
    
    if (!transformationId) {
      // Get recent transformations for the user
      const recentTransformations = await prisma.contentTransformation.findMany({
        where: {
          userId: session.user.id
        },
        select: {
          id: true,
          contentType: true,
          subjectArea: true,
          targetAge: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      });
      
      return NextResponse.json({
        success: true,
        transformations: recentTransformations
      });
    }
    
    // Get specific transformation
    const transformation = await prisma.contentTransformation.findUnique({
      where: {
        id: transformationId
      }
    });
    
    if (!transformation) {
      return NextResponse.json({ error: 'Transformation not found' }, { status: 404 });
    }
    
    // Check if user has access to this transformation
    if (transformation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json({
      success: true,
      transformation: {
        id: transformation.id,
        originalContent: transformation.originalContent,
        contentType: transformation.contentType,
        subjectArea: transformation.subjectArea,
        targetAge: transformation.targetAge,
        complexity: transformation.complexity,
        learningStylePreference: transformation.learningStylePreference,
        transformedContent: {
          visual: transformation.visualContent,
          auditory: transformation.auditoryContent,
          kinesthetic: transformation.kinestheticContent,
          readingWriting: transformation.readingWritingContent,
          multimodal: transformation.multimodalContent
        },
        createdAt: transformation.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error fetching content transformation:', error);
    return NextResponse.json({ error: 'Failed to fetch content transformation' }, { status: 500 });
  }
}
