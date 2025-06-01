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
      studentId, 
      curriculumId,
      subject,
      keyStage,
      settings,
      progressMetrics
    } = data;
    
    // Validate input
    if (!studentId && !curriculumId) {
      return NextResponse.json({ error: 'No student ID or curriculum ID provided' }, { status: 400 });
    }
    
    // Get student data if ID is provided
    let studentData = null;
    let curriculumData = null;
    let learningStyle = null;
    
    if (studentId) {
      // Get student data
      const user = await prisma.user.findUnique({
        where: { id: studentId }
      });
      
      if (user) {
        studentData = {
          id: user.id,
          name: user.name
        };
        
        // Get learning style if needed
        if (settings?.considerLearningStyle) {
          learningStyle = await prisma.learningStyle.findFirst({
            where: { userId: studentId },
            orderBy: { createdAt: 'desc' }
          });
        }
      }
    }
    
    // Get curriculum data if ID is provided
    if (curriculumId) {
      const curriculum = await prisma.curriculumPlan.findUnique({
        where: { id: curriculumId },
        include: { objectives: true }
      });
      
      if (curriculum) {
        curriculumData = {
          id: curriculum.id,
          title: curriculum.title,
          subject: curriculum.subject,
          // Use keyStage instead of gradeLevel which doesn't exist in the schema
          keyStage: curriculum.keyStage || 'Not specified',
          objectives: curriculum.objectives
        };
      }
    }
    
    // Determine baseline pace
    let baselinePace = settings?.baselinePace;
    
    // If adapt to progress is enabled and progress metrics are available
    if (settings?.adaptToProgress && progressMetrics?.recommendedPace) {
      baselinePace = progressMetrics.recommendedPace;
    }
    
    // Determine adaptation type
    let adaptationType = "Standard";
    const standardPace = 50; // Default standard pace
    
    if (baselinePace < standardPace - 10) {
      adaptationType = "Gradual";
    } else if (baselinePace > standardPace + 10) {
      adaptationType = "Accelerated";
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Parse additional styles data if available
    let primaryStyle = '';
    let secondaryStyle = '';
    let visualScore = 0;
    let auditoryScore = 0;
    let kinestheticScore = 0;
    let readingWritingScore = 0;
    
    if (learningStyle) {
      // Get scores directly from the model
      visualScore = learningStyle.visual;
      auditoryScore = learningStyle.auditory;
      kinestheticScore = learningStyle.kinesthetic;
      readingWritingScore = learningStyle.readWrite;
      
      // Parse additional styles data if available
      if (learningStyle.additionalStyles) {
        try {
          const additionalData = JSON.parse(learningStyle.additionalStyles.toString());
          primaryStyle = additionalData.primaryStyle || '';
          secondaryStyle = additionalData.secondaryStyle || '';
        } catch (e) {
          console.error('Error parsing additional styles:', e);
        }
      }
    }
    
    // Create prompt for progress-adaptive pacing
    const prompt = `
      You are an expert educational designer specialising in personalized learning pacing based on individual student progress.
      
      Task: Create a personalized learning pace plan that adapts to the student's progress and learning needs.
      
      ${studentData ? `Student Information:
      - ID: ${studentData.id}
      - Name: ${studentData.name}` : 'No specific student information provided.'}
      
      ${curriculumData ? `Curriculum Information:
      - Title: ${curriculumData.title}
      - Subject: ${curriculumData.subject || 'Not specified'}
      - Key Stage: ${curriculumData.keyStage || 'Not specified'}
      - Objectives: ${JSON.stringify(curriculumData.objectives)}` : `
      Subject: ${subject || 'General'}
      Key Stage: ${keyStage || 'Not specified'}`}
      
      ${learningStyle ? `Learning Style Profile:
      - Primary Style: ${primaryStyle}
      - Secondary Style: ${secondaryStyle}
      - Visual Score: ${visualScore}
      - Auditory Score: ${auditoryScore}
      - Kinesthetic Score: ${kinestheticScore}
      - Reading/Writing Score: ${readingWritingScore}` : ''}
      
      Baseline Pace Level: ${baselinePace}% (${baselinePace < 30 ? 'Gradual' : baselinePace < 60 ? 'Moderate' : 'Accelerated'})
      Adaptation Type: ${adaptationType}
      Adaptation Strength: ${settings?.adaptationStrength}%
      
      Pacing Settings:
      - Adapt to Progress Data: ${settings?.adaptToProgress ? 'Yes' : 'No'}
      - Include Reinforcement Activities: ${settings?.includeReinforcementActivities ? 'Yes' : 'No'}
      - Include Acceleration Options: ${settings?.includeAccelerationOptions ? 'Yes' : 'No'}
      - Consider Learning Style: ${settings?.considerLearningStyle ? 'Yes' : 'No'}
      - Auto-Assess Mastery: ${settings?.autoAssessMastery ? 'Yes' : 'No'}
      - Enable Breakpoints: ${settings?.enableBreakpoints ? 'Yes' : 'No'}
      
      ${progressMetrics ? `Student Progress Metrics:
      - Learning Velocity: ${progressMetrics.learningVelocity}%
      - Mastery Level: ${progressMetrics.masteryLevel}%
      - Engagement Consistency: ${progressMetrics.engagementConsistency}%
      - Knowledge Retention: ${progressMetrics.knowledgeRetention}%
      - Recommended Pace: ${progressMetrics.recommendedPace}%` : ''}
      
      Please create a personalized learning pace plan according to the following guidelines:
      
      1. For Gradual pacing (baseline pace < 40%):
         - Provide more time for concept exploration and practise
         - Include additional reinforcement activities
         - Add strategic breakpoints for reflection and consolidation
         - Ensure mastery before progression to new concepts
         - Focus on depth of understanding over breadth of coverage
      
      2. For Moderate pacing (baseline pace 40-70%):
         - Balance concept exploration with steady progression
         - Include some reinforcement activities for key concepts
         - Add occasional breakpoints at natural transition points
         - Verify understanding of core concepts before progression
         - Balance depth and breadth of coverage
      
      3. For Accelerated pacing (baseline pace > 70%):
         - Allow for faster progression through familiar concepts
         - Include extension activities for deeper exploration
         - Add minimal breakpoints only where essential
         - Verify mastery through more challenging assessments
         - Expand breadth of coverage with opportunities for depth in areas of interest
      
      ${settings?.includeReinforcementActivities ? `
      If including reinforcement activities, please provide:
      - Additional practise exercises for key concepts
      - Alternative explanations using different approaches
      - Real-world application examples
      - Guided review activities
      ` : ''}
      
      ${settings?.includeAccelerationOptions ? `
      If including acceleration options, please provide:
      - Advanced concept exploration opportunities
      - Independent research projects
      - Cross-curricular application challenges
      - Peer teaching opportunities
      ` : ''}
      
      ${settings?.autoAssessMastery ? `
      If including mastery checkpoints, please provide:
      - Key knowledge verification points
      - Skill demonstration opportunities
      - Application challenges
      - Self-assessment prompts
      ` : ''}
      
      ${settings?.enableBreakpoints ? `
      If including strategic breakpoints, please provide:
      - Reflection points for knowledge consolidation
      - Synthesis activities to connect concepts
      - Progress celebration moments
      - Preparation points before new concept introduction
      ` : ''}
      
      Ensure all pacing recommendations are:
      - Evidence-based and pedagogically sound
      - Aligned with UK curriculum standards for the specified key stage
      - Age-appropriate and engaging
      - Supportive of diverse learning needs
      - Using UK English spelling and terminology
      
      Return the personalized pacing plan as a JSON object with the following structure:
      {
        "standardPace": 50,
        "adjustedPace": 70,
        "adaptationType": "Accelerated",
        "estimatedCompletion": "6 weeks",
        "standardDescription": "Brief description of the standard pacing approach",
        "adjustedDescription": "Brief description of the adjusted pacing approach",
        "standardTimeline": [
          {
            "timeframe": "Week 1",
            "milestone": "Introduction to concepts",
            "description": "Brief description of activities"
          },
          // Additional timeline entries...
        ],
        "adjustedTimeline": [
          {
            "timeframe": "Week 1",
            "milestone": "Accelerated introduction and application",
            "description": "Brief description of activities"
          },
          // Additional timeline entries...
        ],
        "reinforcementActivities": [
          "Activity 1 description",
          "Activity 2 description",
          // Additional activities...
        ],
        "accelerationOptions": [
          "Option 1 description",
          "Option 2 description",
          // Additional options...
        ],
        "masteryCheckpoints": [
          "Checkpoint 1 description",
          "Checkpoint 2 description",
          // Additional checkpoints...
        ],
        "breakpoints": [
          "Breakpoint 1 description",
          "Breakpoint 2 description",
          // Additional breakpoints...
        ]
      }
    `;
        // Call AI service for progress-adaptive pacing
    const pacingResponse = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let pacingData;
    try {
      pacingData = JSON.parse(pacingResponse.text);
    } catch (error) {      
      console.error('Error parsing AI response:', error);
      return NextResponse.json({ error: 'Failed to parse pacing data' }, { status: 500 });
    }
    
    // Save the pacing data
    const savedPacing = await prisma.progressPacing.create({
      data: {
        userId: session.user.id,
        studentId: studentId || null,
        curriculumId: curriculumId || null,
        standardPace: pacingData.standardPace,
        adjustedPace: pacingData.adjustedPace,
        adaptationType: pacingData.adaptationType,
        estimatedCompletion: pacingData.estimatedCompletion,
        pacingData: pacingData,
        settings: settings,
        subject: subject || null,
        keyStage: keyStage || null,
        learningStyleUsed: learningStyle ? true : false,
        progressMetricsUsed: progressMetrics ? true : false
      }
    });
    
    return NextResponse.json({
      success: true,
      pacingData,
      pacingId: savedPacing.id
    });
    
  } catch (error) {
    console.error('Error in progress-adaptive pacing:', error);
    return NextResponse.json({ error: 'Failed to adjust learning pace' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const curriculumId = searchParams.get('curriculumId');
    
    // Get user's progress pacing data
    const progressPacings = await prisma.progressPacing.findMany({
      where: {
        userId: session.user.id,
        ...(studentId ? { studentId } : {}),
        ...(curriculumId ? { curriculumId } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json({
      success: true,
      progressPacings
    });
    
  } catch (error) {
    console.error('Error fetching progress pacing data:', error);
    return NextResponse.json({ error: 'Failed to fetch progress pacing data' }, { status: 500 });
  }
}
