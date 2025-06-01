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
      content, 
      title,
      subject,
      keyStage,
      contentId,
      settings 
    } = data;
    
    // Validate input
    if (!content && !contentId && !title) {
      return NextResponse.json({ error: 'No content, title, or content ID provided' }, { status: 400 });
    }
    
    // Get content if ID is provided
    let contentToTransform = content;
    let contentTitle = title;
    let contentSubject = subject;
    let contentKeyStage = keyStage;
    
    if (contentId) {
      // Check if it's a curriculum plan
      const curriculumPlan = await prisma.curriculumPlan.findUnique({
        where: { id: contentId }
      });
      
      if (curriculumPlan) {
        contentToTransform = curriculumPlan.content || '';
        contentTitle = curriculumPlan.title;
        contentSubject = curriculumPlan.subject || '';
        contentKeyStage = curriculumPlan.keyStage || '';
      } else {
        // Check if it's a resource
        const resource = await prisma.resource.findUnique({
          where: { id: contentId }
        });
        
        if (resource) {
          // Use description instead of content (which doesn't exist in the schema)
          contentToTransform = resource.description || '';
          contentTitle = resource.title;
          // Resource model doesn't have tags property, use default values
          contentSubject = subject || '';
          contentKeyStage = keyStage || '';
        } else {
          return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }
      }
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Create prompt for multi-modal content generation
    const prompt = `
      You are an expert educational content designer specialising in multi-modal learning experiences.
      
      Task: Transform the following educational content into a multi-modal presentation that engages multiple sensory channels simultaneously.
      
      Original Content:
      ${contentToTransform || 'No specific content provided. Generate appropriate content based on the title: ' + contentTitle}
      
      Title: ${contentTitle || 'Educational Content'}
      Subject: ${contentSubject || 'General'}
      Key Stage: ${contentKeyStage || 'Not specified'}
      
      Presentation Settings:
      - Include Visual Content: ${settings?.includeVisual ? 'Yes' : 'No'}
      - Include Audio Content: ${settings?.includeAudio ? 'Yes' : 'No'}
      - Include Text Content: ${settings?.includeText ? 'Yes' : 'No'}
      - Include Interactive Elements: ${settings?.includeInteractive ? 'Yes' : 'No'}
      - Accessibility Level: ${settings?.accessibilityLevel}
      - Content Complexity: ${settings?.contentComplexity}%
      
      Create a multi-modal presentation with the following characteristics:
      
      1. Break the content into 5-8 logical slides or sections
      2. For each slide/section, provide:
         - A clear title
         - Visual content description (if includeVisual is true)
         - Audio narration script (if includeAudio is true)
         - Text content in HTML format (if includeText is true)
         - Interactive element description (if includeInteractive is true)
      
      ${settings?.accessibilityLevel === 'high' || settings?.accessibilityLevel === 'maximum' ?
        'Include additional accessibility features such as alternative text for images, transcripts for audio, and clear navigation cues.' : ''}
      
      ${settings?.accessibilityLevel === 'maximum' ?
        'Provide comprehensive accessibility support including simplified language options, colour contrast considerations, and keyboard navigation instructions.' : ''}
      
      Ensure all content is:
      - Evidence-based and pedagogically sound
      - Aligned with UK curriculum standards for the specified key stage
      - Age-appropriate and engaging
      - Free from cultural bias and inclusive of diverse perspectives
      - Using UK English spelling and terminology
      
      Return the multi-modal content as a JSON object with the following structure:
      {
        "title": "Overall presentation title",
        "subject": "Subject area",
        "keyStage": "Key stage",
        "slides": [
          {
            "title": "Slide 1 title",
            "visualContent": "Description of visual content for slide 1",
            "audioContent": "Script for audio narration for slide 1",
            "textContent": "HTML-formatted text content for slide 1",
            "interactiveContent": "Description of interactive element for slide 1"
          },
          // Additional slides...
        ],
        "accessibilityFeatures": [
          "List of accessibility features included"
        ]
      }
    `;
    
    // Call AI service for multi-modal content generation
    const multiModalResponse = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let multiModalContent;
    try {
      multiModalContent = JSON.parse(multiModalResponse.text);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json({ error: 'Failed to parse multi-modal content' }, { status: 500 });
    }
    
    // Save the multi-modal content
    const savedContent = await prisma.multiModalContent.create({
      data: {
        userId: session.user.id,
        title: multiModalContent.title || contentTitle || 'Multi-Modal Content',
        originalContent: contentToTransform || '',
        multiModalContent: multiModalContent,
        settings: settings,
        subject: contentSubject || multiModalContent.subject || null,
        keyStage: contentKeyStage || multiModalContent.keyStage || null,
        sourceContentId: contentId || null
      }
    });
    
    return NextResponse.json({
      success: true,
      multiModalContent,
      contentId: savedContent.id
    });
    
  } catch (error) {
    console.error('Error in multi-modal content generation:', error);
    return NextResponse.json({ error: 'Failed to generate multi-modal content' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');
    
    // Get user's multi-modal content
    const multiModalContents = await prisma.multiModalContent.findMany({
      where: {
        userId: session.user.id,
        ...(contentId ? { sourceContentId: contentId } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json({
      success: true,
      multiModalContents
    });
    
  } catch (error) {
    console.error('Error fetching multi-modal content:', error);
    return NextResponse.json({ error: 'Failed to fetch multi-modal content' }, { status: 500 });
  }
}
