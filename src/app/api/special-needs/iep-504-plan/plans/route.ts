import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema for plan creation/update
const planSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  planType: z.enum(["iep", "504"]),
  studentName: z.string().min(1, "Student name is required"),
  studentId: z.string().optional(),
  dateOfBirth: z.date().optional(),
  startDate: z.date(),
  reviewDate: z.date(),
  presentLevels: z.string().optional(),
  strengths: z.string().optional(),
  challenges: z.string().optional(),
  parentInput: z.string().optional(),
  studentInput: z.string().optional(),
  status: z.enum(["draft", "active", "review", "completed"]).default("draft"),
  goals: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      area: z.string(),
      description: z.string(),
      baselineData: z.string().optional(),
      evaluationMethod: z.string(),
      mastery: z.string().optional(),
      timeline: z.string().optional(),
      objectives: z.array(z.string()),
      progress: z.number().default(0)
    })
  ).optional(),
  accommodations: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      category: z.string(),
      description: z.string(),
      frequency: z.string().optional(),
      location: z.string().optional(),
      provider: z.string().optional(),
      notes: z.string().optional()
    })
  ).optional(),
  services: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      provider: z.string(),
      frequency: z.string(),
      duration: z.string(),
      location: z.string().optional(),
      startDate: z.date(),
      endDate: z.date(),
      description: z.string().optional()
    })
  ).optional(),
  teamMembers: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      role: z.string(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      notes: z.string().optional()
    })
  ).optional()
});

// GET handler to retrieve all plans for a user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get all plans for the user
    const plans = await (prisma as any).iEP504Plan.findMany({
      where: {
        userId: userId
      },
      include: {
        goals: true,
        accommodations: true,
        services: true,
        teamMembers: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error retrieving plans:', error);
    return NextResponse.json({ error: 'Failed to retrieve plans' }, { status: 500 });
  }
}

// POST handler to create a new plan
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await req.json();
    
    // Validate the request data
    const validatedData = planSchema.parse(data);
    
    // Create the plan with a transaction to ensure all related records are created
    const result = await prisma.$transaction(async (prisma) => {
      // Create the main plan
      const plan = await (prisma as any).iEP504Plan.create({
        data: {
          userId,
          title: validatedData.title,
          planType: validatedData.planType,
          studentName: validatedData.studentName,
          studentId: validatedData.studentId,
          dateOfBirth: validatedData.dateOfBirth,
          startDate: validatedData.startDate,
          reviewDate: validatedData.reviewDate,
          presentLevels: validatedData.presentLevels,
          strengths: validatedData.strengths,
          challenges: validatedData.challenges,
          parentInput: validatedData.parentInput,
          studentInput: validatedData.studentInput,
          status: validatedData.status,
          progress: 0
        }
      });
      
      // Create goals if provided
      if (validatedData.goals && validatedData.goals.length > 0) {
        await Promise.all(validatedData.goals.map(goal => 
          (prisma as any).iEP504Goal.create({
            data: {
              planId: plan.id,
              title: goal.title,
              area: goal.area,
              description: goal.description,
              baselineData: goal.baselineData,
              evaluationMethod: goal.evaluationMethod,
              mastery: goal.mastery,
              timeline: goal.timeline,
              objectives: goal.objectives,
              progress: goal.progress || 0
            }
          })
        ));
      }
      
      // Create accommodations if provided
      if (validatedData.accommodations && validatedData.accommodations.length > 0) {
        await Promise.all(validatedData.accommodations.map(accommodation => 
          (prisma as any).iEP504Accommodation.create({
            data: {
              planId: plan.id,
              title: accommodation.title,
              category: accommodation.category,
              description: accommodation.description,
              frequency: accommodation.frequency,
              location: accommodation.location,
              provider: accommodation.provider,
              notes: accommodation.notes
            }
          })
        ));
      }
      
      // Create services if provided
      if (validatedData.services && validatedData.services.length > 0) {
        await Promise.all(validatedData.services.map(service => 
          (prisma as any).iEP504Service.create({
            data: {
              planId: plan.id,
              title: service.title,
              provider: service.provider,
              frequency: service.frequency,
              duration: service.duration,
              location: service.location,
              startDate: service.startDate,
              endDate: service.endDate,
              description: service.description
            }
          })
        ));
      }
      
      // Create team members if provided
      if (validatedData.teamMembers && validatedData.teamMembers.length > 0) {
        await Promise.all(validatedData.teamMembers.map(member => 
          (prisma as any).iEP504TeamMember.create({
            data: {
              planId: plan.id,
              name: member.name,
              role: member.role,
              email: member.email,
              phone: member.phone,
              notes: member.notes
            }
          })
        ));
      }
      
      // Log the creation
      await (prisma as any).iEP504PlanLog.create({
        data: {
          userId,
          planId: plan.id,
          action: 'create',
          details: { message: `Created ${validatedData.planType.toUpperCase()} plan: ${validatedData.title}` }
        }
      });
      
      return plan;
    });
    
    return NextResponse.json({ 
      message: 'Plan created successfully', 
      plan: result 
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}
