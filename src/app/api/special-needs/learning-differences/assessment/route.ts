import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // In a real implementation, this would process assessment data
    // For now, we'll simulate an assessment result based on user ID
    // This would be replaced with actual assessment logic
    
    // Simulated assessment results
    const assessmentResults = {
      dyslexia: Math.random() * 0.8 + 0.1, // Between 0.1 and 0.9
      dyscalculia: Math.random() * 0.8 + 0.1,
      adhd: Math.random() * 0.8 + 0.1,
      autism: Math.random() * 0.8 + 0.1,
      visualSensitivity: Math.random() * 0.8 + 0.1,
      processingSpeed: Math.random() * 0.8 + 0.1,
      workingMemory: Math.random() * 0.8 + 0.1,
      completedAt: new Date(),
    };
    
    // Store assessment results in user profile
    const profile = await prisma.learningDifferenceProfile.upsert({
      where: {
        userId
      },
      update: {
        assessmentResults,
        updatedAt: new Date()
      },
      create: {
        userId,
        assessmentResults,
        settings: {
          dyslexiaSupport: false,
          dyscalculiaSupport: false,
          adhdSupport: false,
          autismSupport: false,
          textToSpeech: false,
          fontAdjustments: false,
          colorOverlays: false,
          mathSupports: false,
          focusTools: false,
          sensoryConsiderations: false,
          fontType: 'standard',
          lineSpacing: 1.5,
          colorScheme: 'standard',
          readingSpeed: 1.0
        }
      }
    });
    
    return NextResponse.json({ 
      results: assessmentResults,
      message: 'Assessment completed successfully'
    });
    
  } catch (error) {
    console.error('Error in learning differences assessment API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
