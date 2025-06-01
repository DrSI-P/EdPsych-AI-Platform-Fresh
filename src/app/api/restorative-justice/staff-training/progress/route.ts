import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for progress validation
const progressSchema = z.object({
  userId: z.string().uuid(),
  moduleId: z.string().uuid(),
  action: z.enum(['access', 'complete', 'quiz']),
  sectionId: z.string().uuid().optional(),
  quizId: z.string().uuid().optional(),
  score: z.number().min(0).max(100).optional(),
});

// Define interfaces for request data
interface TrainingProgress {
  id: string;
  userId: string;
  moduleId: string;
  lastAccessedAt: Date;
  completedSections: any[];
  certificateIssued?: boolean;
}

interface QuizAttempt {
  progressId: string;
  quizId: string;
  score: number;
  attemptedAt: Date;
}

interface User {
  id: string;
  role: string;
}

interface TrainingModule {
  id: string;
  sections: Array<{
    id: string;
  }>;
}

// GET handler for retrieving user progress
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get userId from query params or use current user
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || session.user.id;
    
    // Check if requesting user is the same as the target user or has admin role
    if (userId !== session.user.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      }) as User | null;
      
      if (user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    
    // Get user progress from database
    const progress = await prisma.restorativeTrainingProgress.findMany({
      where: { userId },
      include: {
        quizAttempts: true
      }
    });
    
    return NextResponse.json(progress);
  } catch (error) {
    // Using a type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to retrieve progress' }, { status: 500 });
  }
}

// POST handler for updating user progress
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    
    try {
      const validatedData = progressSchema.parse(body);
      
      // Check if user is updating their own progress or has admin role
      if (validatedData.userId !== session.user.id) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { role: true }
        }) as User | null;
        
        if (user?.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
      
      // Handle different action types
      switch (validatedData.action) {
        case 'access': {
          // Record module access
          const existingProgress = await prisma.restorativeTrainingProgress.findFirst({
            where: {
              userId: validatedData.userId,
              moduleId: validatedData.moduleId
            }
          }) as TrainingProgress | null;
          
          if (!existingProgress) {
            await prisma.restorativeTrainingProgress.create({
              data: {
                userId: validatedData.userId,
                moduleId: validatedData.moduleId,
                lastAccessedAt: new Date(),
                completedSections: []
              }
            });
          } else {
            await prisma.restorativeTrainingProgress.update({
              where: { id: existingProgress.id },
              data: { lastAccessedAt: new Date() }
            });
          }
          
          break;
        }
          
        case 'complete': {
          // Mark section as complete
          if (!validatedData.sectionId) {
            return NextResponse.json({ error: 'Section ID is required for complete action' }, { status: 400 });
          }
          
          // Get existing progress or create new
          let progress = await prisma.restorativeTrainingProgress.findFirst({
            where: {
              userId: validatedData.userId,
              moduleId: validatedData.moduleId
            }
          }) as TrainingProgress | null;
          
          if (!progress) {
            progress = await prisma.restorativeTrainingProgress.create({
              data: {
                userId: validatedData.userId,
                moduleId: validatedData.moduleId,
                lastAccessedAt: new Date(),
                completedSections: [validatedData.sectionId]
              }
            }) as TrainingProgress;
          } else {
            // Update existing progress
            const completedSections = [...progress.completedSections];
            if (!completedSections.includes(validatedData.sectionId)) {
              completedSections.push(validatedData.sectionId);
            }
            
            progress = await prisma.restorativeTrainingProgress.update({
              where: { id: progress.id },
              data: {
                lastAccessedAt: new Date(),
                completedSections
              }
            }) as TrainingProgress;
          }
          
          // Check if all sections are completed to issue certificate
          const trainingModule = await prisma.restorativeTrainingModule.findUnique({
            where: { id: validatedData.moduleId },
            include: { sections: true }
          }) as TrainingModule | null;
          
          if (trainingModule && progress.completedSections.length === trainingModule.sections.length) {
            await prisma.restorativeTrainingProgress.update({
              where: { id: progress.id },
              data: { certificateIssued: true }
            });
          }
          
          return NextResponse.json(progress);
        }
          
        case 'quiz': {
          // Record quiz attempt
          if (!validatedData.quizId || validatedData.score === undefined) {
            return NextResponse.json({ error: 'Quiz ID and score are required for quiz action' }, { status: 400 });
          }
          
          // Get existing progress or create new
          let quizProgress = await prisma.restorativeTrainingProgress.findFirst({
            where: {
              userId: validatedData.userId,
              moduleId: validatedData.moduleId
            }
          }) as TrainingProgress | null;
          
          if (!quizProgress) {
            quizProgress = await prisma.restorativeTrainingProgress.create({
              data: {
                userId: validatedData.userId,
                moduleId: validatedData.moduleId,
                lastAccessedAt: new Date(),
                completedSections: []
              }
            }) as TrainingProgress;
          }
          
          // Record quiz attempt
          const quizAttempt = await prisma.restorativeTrainingQuizAttempt.create({
            data: {
              progressId: quizProgress.id,
              quizId: validatedData.quizId,
              score: validatedData.score,
              attemptedAt: new Date()
            }
          }) as QuizAttempt;
          
          return NextResponse.json({ progress: quizProgress, quizAttempt });
        }
          
        default:
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
      
      return NextResponse.json({ success: true });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ error: validationError.errors }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    // Using a type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
