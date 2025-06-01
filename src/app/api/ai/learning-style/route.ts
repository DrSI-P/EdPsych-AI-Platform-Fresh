import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import { getAIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { answers } = data;
    
    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'No assessment answers provided' }, { status: 400 });
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Create prompt for learning style analysis
    const prompt = `
      Analyse the following learning style assessment answers and determine the primary and secondary learning styles.
      Provide detailed descriptions and personalized learning strategies for each style.
      
      The learning styles to consider are:
      1. Visual - learns best through seeing information presented visually
      2. Auditory - learns best through listening and verbal communication
      3. Kinesthetic - learns best through physical activities and hands-on experiences
      4. Reading/Writing - learns best through reading and writing text
      
      For each learning style, provide:
      - A score from 0-100 indicating strength in this area
      - A detailed description of the learning style as it applies to this person
      - 5 specific learning strategies tailored to this style
      
      Also provide 6 personalized recommendations that combine the primary and secondary styles.
      
      Format the response as JSON with the following structure:
      {
        "primaryStyle": {
          "name": "Style name",
          "score": score,
          "description": "detailed description",
          "strategies": ["strategy1", "strategy2", "strategy3", "strategy4", "strategy5"]
        },
        "secondaryStyle": {
          "name": "Style name",
          "score": score,
          "description": "detailed description",
          "strategies": ["strategy1", "strategy2", "strategy3", "strategy4", "strategy5"]
        },
        "allStyles": [
          {
            "name": "Style name",
            "score": score,
            "description": "brief description",
            "strategies": ["strategy1", "strategy2", "strategy3"]
          },
          // repeat for all 4 styles
        ],
        "personalizedRecommendations": ["rec1", "rec2", "rec3", "rec4", "rec5", "rec6"]
      }
      
      Answers:
      ${Object.entries(answers).map(([question, answer]) => {
        return `${question}: ${answer}`;
      }).join('\n')}
    `;
    
    // Call AI service for analysis
    const aiResponse = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000
    });
    
    // Parse AI response
    let results;
    try {
      results = JSON.parse(aiResponse.text);
    } catch (error) {
      // Replace console.error with structured logging when available
      console.error('Failed to parse AI response:', error);
      return NextResponse.json({ error: 'Failed to analyse learning style' }, { status: 500 });
    }
    
    // Save results to database
    const learningStyle = await prisma.learningStyle.create({
      data: {
        userId: session.user.id,
        visual: results.allStyles.find((s: { name: string; score: number }) => s.name === 'Visual')?.score || 0,
        auditory: results.allStyles.find((s: { name: string; score: number }) => s.name === 'Auditory')?.score || 0,
        kinesthetic: results.allStyles.find((s: { name: string; score: number }) => s.name === 'Kinesthetic')?.score || 0,
        readWrite: results.allStyles.find((s: { name: string; score: number }) => s.name === 'Reading/Writing')?.score || 0,
        assessmentResults: JSON.stringify(results),
        additionalStyles: JSON.stringify({
          primaryStyle: results.primaryStyle.name,
          secondaryStyle: results.secondaryStyle.name,
          recommendations: results.personalizedRecommendations
        })
      }
    });
    
    return NextResponse.json({
      success: true,
      results,
      profileId: learningStyle.id
    });
    
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error in learning style assessment:', error);
    return NextResponse.json({ error: 'Failed to process learning style assessment' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's most recent learning style profile
    const learningStyle = await prisma.learningStyle.findFirst({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!learningStyle) {
      return NextResponse.json({ 
        success: true,
        hasProfile: false 
      });
    }
    
    // Parse additional styles data with proper error handling
    let additionalData = {
      primaryStyle: '',
      secondaryStyle: '',
      recommendations: []
    };
    
    if (learningStyle.additionalStyles) {
      try {
        const parsedData = JSON.parse(learningStyle.additionalStyles.toString());
        if (parsedData && typeof parsedData === 'object') {
          additionalData = {
            primaryStyle: parsedData.primaryStyle || '',
            secondaryStyle: parsedData.secondaryStyle || '',
            recommendations: Array.isArray(parsedData.recommendations) ? parsedData.recommendations : []
          };
        }
      } catch (e) {
        // Replace console.error with structured logging when available
        console.error('Error parsing additional styles:', e);
        // Continue with default values
      }
    }
    
    // Parse assessment results with proper error handling
    let results = {};
    if (learningStyle.assessmentResults) {
      try {
        const parsedResults = JSON.parse(learningStyle.assessmentResults.toString());
        if (parsedResults && typeof parsedResults === 'object') {
          results = parsedResults;
        }
      } catch (e) {
        // Replace console.error with structured logging when available
        console.error('Error parsing assessment results:', e);
        // Continue with empty results
      }
    }
    
    return NextResponse.json({
      success: true,
      hasProfile: true,
      profile: {
        id: learningStyle.id,
        primaryStyle: additionalData.primaryStyle,
        secondaryStyle: additionalData.secondaryStyle,
        visualScore: learningStyle.visual,
        auditoryScore: learningStyle.auditory,
        kinestheticScore: learningStyle.kinesthetic,
        readingWritingScore: learningStyle.readWrite,
        results: results,
        createdAt: learningStyle.createdAt
      }
    });
    
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error fetching learning style profile:', error);
    return NextResponse.json({ error: 'Failed to fetch learning style profile' }, { status: 500 });
  }
}
