import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { db } from '@/lib/db';
import { aiServiceServer } from '@/lib/ai/ai-service-server';

// Define interfaces for type safety
interface AdaptiveComplexitySettings {
  targetComplexity: number;
  preserveMultiModal: boolean;
  includeScaffolding: boolean;
  includeExtensions: boolean;
  autoAssessComprehension: boolean;
}

interface AdjustedContent {
  title: string;
  originalContent: string;
  adjustedContent: string;
  originalComplexity: number;
  adjustedComplexity: number;
  adaptationType: string;
  scaffolding?: string;
  extensions?: string;
  comprehensionChecks?: string;
}

interface PerformanceMetrics {
  readingLevel: number;
  comprehensionRate: number;
  engagementScore: number;
  learningPreferences: any[];
}

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    
    // Extract parameters
    const {
      content,
      contentId,
      title: contentTitle,
      subject: contentSubject,
      keyStage: contentKeyStage,
      settings,
      performanceMetrics
    } = body;
    
    // Validate required fields
    if (!content && !contentId && !contentTitle) {
      return NextResponse.json(
        { error: 'Either content, contentId, or title must be provided' },
        { status: 400 }
      );
    }
    
    // Get content to adjust
    let contentToAdjust = content;
    
    if (contentId) {
      // Fetch content from database
      const curriculumPlan = await db.curriculumPlan.findUnique({
        where: { id: contentId }
      });
      
      if (curriculumPlan) {
        contentToAdjust = curriculumPlan.content;
      } else {
        // Try to find as a resource
        const resource = await db.resource.findUnique({
          where: { id: contentId }
        });
        
        if (resource) {
          // Use description or url as content if resource doesn't have content property
          contentToAdjust = resource.description || resource.url || 'No content available';
        } else {
          return NextResponse.json(
            { error: 'Content not found with the provided ID' },
            { status: 404 }
          );
        }
      }
    }
    
    // Construct prompt for AI service
    const prompt = `
      You are an educational content adaptation specialist with expertise in adjusting the complexity of learning materials to meet the needs of diverse learners. Your task is to adapt the following educational content to a complexity level of ${settings?.targetComplexity || 50}% (where 0% is extremely simple and 100% is highly complex).
      
      ${performanceMetrics ? `
      Consider these student performance metrics when adapting the content:
      - Reading level: ${performanceMetrics.readingLevel}/10
      - Comprehension rate: ${performanceMetrics.comprehensionRate}%
      - Engagement score: ${performanceMetrics.engagementScore}/10
      - Learning preferences: ${performanceMetrics.learningPreferences.join(', ')}
      ` : ''}
      
      Original content to adapt:
      """
      ${contentToAdjust}
      """
      
      ${settings?.preserveMultiModal ? 'Preserve all multi-modal elements (images, videos, interactive components) while adapting the text complexity.' : 'Focus on adapting the text content; you may simplify or modify multi-modal elements as needed.'}
      
      Guidelines for complexity adjustment:
      
      1. For Simple content (target complexity < 30%):
         - Use basic vocabulary and short, clear sentences
         - Break down complex concepts into step-by-step explanations
         - Use concrete examples rather than abstract concepts
         - Include visual supports if preserving multi-modal elements
      
      2. For Moderate content (target complexity 30-70%):
         - Use a mix of simple and more specialized vocabulary
         - Include some compound and complex sentences
         - Provide explanations with some room for inference
         - Balance concrete examples with some abstract concepts
         - Include a variety of presentation methods if preserving multi-modal elements
      
      3. For Complex content (target complexity > 70%):
         - Use rich, subject-specific vocabulary
         - Include more complex sentence structures and academic language
         - Encourage critical thinking and inference
         - Explore abstract concepts and theoretical frameworks
         - Include sophisticated multi-modal elements if preserving them
      
      ${settings?.includeScaffolding ? `
      If including scaffolding, please provide:
      - Key vocabulary definitions
      - Step-by-step guidance for complex procedures
      - Visual organizers or frameworks
      - Prompting questions to guide understanding
      ` : ''}
      
      ${settings?.includeExtensions ? `
      If including extensions, please provide:
      - Deeper exploration of concepts
      - Critical thinking questions
      - Application challenges
      - Independent research suggestions
      ` : ''}
      
      ${settings?.autoAssessComprehension ? `
      If including comprehension checks, please provide:
      - Key questions to check understanding
      - Self-assessment prompts
      - Quick knowledge checks
      - Reflection questions
      ` : ''}
      
      Ensure all content is:
      - Evidence-based and pedagogically sound
      - Aligned with UK curriculum standards for the specified key stage
      - Age-appropriate and engaging
      - Free from cultural bias and inclusive of diverse perspectives
      - Using UK English spelling and terminology
      
      Return the adjusted content as a JSON object with the following structure:
      {
        "title": "Content title",
        "originalContent": "HTML-formatted original content",
        "adjustedContent": "HTML-formatted adjusted content",
        "originalComplexity": 50,
        "adjustedComplexity": 30,
        "adaptationType": "Simplified",
        "scaffolding": "HTML-formatted scaffolding content (if includeScaffolding is true)",
        "extensions": "HTML-formatted extension activities (if includeExtensions is true)",
        "comprehensionChecks": "HTML-formatted comprehension checks (if autoAssessComprehension is true)"
      }
    `;
    
    // Call AI service for adaptive complexity adjustment
    const response = await aiServiceServer.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let adjustedContent: AdjustedContent;
    try {
      adjustedContent = JSON.parse(response.text) as AdjustedContent;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json({ error: 'Failed to parse adjusted content' }, { status: 500 });
    }
    
    // Save the adjusted content using db interface
    const savedContent = await db.adaptiveContent.create({
      data: {
        userId: session.user.id,
        title: adjustedContent.title || contentTitle || 'Adjusted Content',
        originalContent: contentToAdjust || '',
        adjustedContent: adjustedContent as any, // Type cast needed for Prisma schema compatibility
        settings: settings as any, // Type cast needed for Prisma schema compatibility
        subject: contentSubject || undefined,
        keyStage: contentKeyStage || undefined,
        sourceContentId: contentId || undefined,
        performanceMetricsUsed: performanceMetrics ? true : false
      }
    });
    
    return NextResponse.json({
      success: true,
      adjustedContent,
      contentId: savedContent.id
    });
    
  } catch (error) {
    console.error('Error in adaptive complexity adjustment:', error);
    return NextResponse.json({ error: 'Failed to adjust content complexity' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');
    
    // Get user's adaptive content using db interface
    const adaptiveContents = await db.adaptiveContent.findMany({
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
      adaptiveContents
    });
    
  } catch (error) {
    console.error('Error fetching adaptive content:', error);
    return NextResponse.json({ error: 'Failed to fetch adaptive content' }, { status: 500 });
  }
}
