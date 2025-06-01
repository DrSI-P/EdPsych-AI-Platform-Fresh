import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for mentor/mentee profile
const profileSchema = z.object({
  userId: z.string(),
  role: z.enum(['mentor', 'mentee', 'both']),
  school: z.string().min(2).max(100),
  phase: z.string(),
  yearsExperience: z.number().min(0),
  expertise: z.array(z.number()),
  subjects: z.array(z.string()),
  bio: z.string().optional(),
  availability: z.string().optional(),
  goals: z.string().optional(),
  mentorshipPreferences: z.object({
    frequency: z.string().optional(),
    format: z.array(z.string()).optional(),
    focusAreas: z.array(z.number()).optional()
  }).optional()
});

// Schema for mentorship request
const mentorshipRequestSchema = z.object({
  mentorId: z.string(),
  menteeId: z.string(),
  message: z.string(),
  focusAreas: z.array(z.number()),
  goals: z.array(z.string()),
  duration: z.string(),
  frequency: z.string()
});

// Schema for mentorship
const mentorshipSchema = z.object({
  mentorId: z.string(),
  menteeId: z.string(),
  status: z.enum(['pending', 'active', 'completed', 'declined']),
  startDate: z.string(),
  endDate: z.string().optional(),
  focusAreas: z.array(z.number()),
  goals: z.array(z.object({
    text: z.string(),
    status: z.enum(['not_started', 'in_progress', 'completed'])
  }))
});

// Schema for meeting
const meetingSchema = z.object({
  mentorshipId: z.string(),
  date: z.string(),
  duration: z.number(),
  format: z.string(),
  agenda: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled'])
});

// Schema for resource
const resourceSchema = z.object({
  mentorshipId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.string(),
  url: z.string().optional(),
  fileUrl: z.string().optional()
});

// Schema for feedback
const feedbackSchema = z.object({
  mentorshipId: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  meetingId: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'updateProfile':
        return handleUpdateProfile(body);
      case 'requestMentorship':
        return handleRequestMentorship(body);
      case 'respondToRequest':
        return handleRespondToRequest(body);
      case 'updateMentorship':
        return handleUpdateMentorship(body);
      case 'addMeeting':
        return handleAddMeeting(body);
      case 'updateMeeting':
        return handleUpdateMeeting(body);
      case 'addResource':
        return handleAddResource(body);
      case 'addFeedback':
        return handleAddFeedback(body);
      case 'updateGoal':
        return handleUpdateGoal(body);
      case 'completeMentorship':
        return handleCompleteMentorship(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in mentor matching API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleUpdateProfile(body) {
  try {
    const { userId, ...profileData } = profileSchema.parse(body);

    // Check if profile exists
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId }
    });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.mentorProfile.update({
        where: { userId },
        data: {
          ...profileData,
          mentorshipPreferences: profileData.mentorshipPreferences || undefined,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new profile
      profile = await prisma.mentorProfile.create({
        data: {
          ...profileData,
          mentorshipPreferences: profileData.mentorshipPreferences || undefined,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    // Update user's CPD profile with mentorship information
    await prisma.cPDProfile.upsert({
      where: { userId },
      update: {
        mentorshipRole: profileData.role,
        mentorshipExpertise: profileData.expertise,
        updatedAt: new Date()
      },
      create: {
        userId,
        mentorshipRole: profileData.role,
        mentorshipExpertise: profileData.expertise,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { message: 'Profile updated successfully', profile },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleRequestMentorship(body) {
  try {
    const requestData = mentorshipRequestSchema.parse(body);
    
    // Create mentorship request
    const request = await prisma.mentorshipRequest.create({
      data: {
        mentorId: requestData.mentorId,
        menteeId: requestData.menteeId,
        message: requestData.message,
        focusAreas: requestData.focusAreas,
        goals: requestData.goals,
        duration: requestData.duration,
        frequency: requestData.frequency,
        status: 'pending' as 'pending' | 'accepted' | 'declined',
        createdAt: new Date()
      }
    });

    // Send notification to mentor (in a real implementation)
    
    return NextResponse.json(
      { message: 'Mentorship request sent successfully', request },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleRespondToRequest(body) {
  try {
    const { requestId, response, message } = body;
    
    if (!requestId || !response) {
      return NextResponse.json(
        { error: 'Request ID and response are required' },
        { status: 400 }
      );
    }
    
    // Check if request exists
    const request = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId }
    });
    
    if (!request) {
      return NextResponse.json(
        { error: 'Mentorship request not found' },
        { status: 404 }
      );
    }
    
    // Update request status
    const updatedRequest = await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: {
        status: response === 'accept' ? 'accepted' : 'declined',
        responseMessage: message,
        respondedAt: new Date()
      }
    });
    
    // If accepted, create mentorship
    if (response === 'accept') {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + parseInt(request.duration));
      
      const mentorship = await prisma.mentorship.create({
        data: {
          mentorId: request.mentorId,
          menteeId: request.menteeId,
          status: 'active' as 'active' | 'pending' | 'completed' | 'declined',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          focusAreas: request.focusAreas,
          goals: request.goals.map((goal: string) => ({
            text: goal,
            status: 'not_started' as 'not_started' | 'in_progress' | 'completed'
          })),
          frequency: request.frequency,
          requestId: requestId,
          createdAt: new Date()
        }
      });
      
      // Create CPD activity for both mentor and mentee
      await prisma.cPDActivity.create({
        data: {
          userId: request.mentorId,
          title: `Mentorship with ${request.menteeId} - Providing mentorship focusing on ${request.focusAreas.join(', ')}`,
          type: 'Mentorship',
          date: startDate.toISOString(),
          duration: 0, // Will be updated as meetings occur
          status: 'In Progress',
          evidence: '',
          reflection: '',
          points: 0, // Will be updated as meetings occur
          createdAt: new Date()
        }
      });
      
      await prisma.cPDActivity.create({
        data: {
          userId: request.menteeId,
          title: `Mentorship with ${request.mentorId} - Receiving mentorship focusing on ${request.focusAreas.join(', ')}`,
          type: 'Mentorship',
          date: startDate.toISOString(),
          duration: 0, // Will be updated as meetings occur
          status: 'In Progress',
          evidence: '',
          reflection: '',
          points: 0, // Will be updated as meetings occur
          createdAt: new Date()
        }
      });
      
      return NextResponse.json(
        { 
          message: 'Mentorship request accepted and mentorship created', 
          request: updatedRequest,
          mentorship 
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { message: 'Mentorship request declined', request: updatedRequest },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleUpdateMentorship(body) {
  try {
    const { id, ...mentorshipData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Mentorship ID is required' },
        { status: 400 }
      );
    }
    
    // Check if mentorship exists
    const existingMentorship = await prisma.mentorship.findUnique({
      where: { id }
    });
    
    if (!existingMentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found' },
        { status: 404 }
      );
    }
    
    // Update mentorship
    const mentorship = await prisma.mentorship.update({
      where: { id },
      data: {
        ...mentorshipData,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json(
      { message: 'Mentorship updated successfully', mentorship },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleAddMeeting(body) {
  try {
    const meetingData = meetingSchema.parse(body);
    
    // Check if mentorship exists
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: meetingData.mentorshipId }
    });
    
    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found' },
        { status: 404 }
      );
    }
    
    // Create meeting
    const meeting = await prisma.mentorshipMeeting.create({
      data: {
        ...meetingData,
        createdAt: new Date()
      }
    });
    
    return NextResponse.json(
      { message: 'Meeting added successfully', meeting },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid meeting data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateMeeting(body) {
  try {
    const { id, ...meetingData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      );
    }
    
    // Check if meeting exists
    const existingMeeting = await prisma.mentorshipMeeting.findUnique({
      where: { id }
    });
    
    if (!existingMeeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }
    
    // Update meeting
    const meeting = await prisma.mentorshipMeeting.update({
      where: { id },
      data: {
        ...meetingData,
        updatedAt: new Date()
      }
    });
    
    // If meeting is completed, update CPD records
    if (meetingData.status === 'completed' && existingMeeting.status !== 'completed') {
      const mentorship = await prisma.mentorship.findUnique({
        where: { id: existingMeeting.mentorshipId }
      });
      
      if (mentorship) {
        // Update mentor's CPD record
        const mentorCpd = await prisma.cPDActivity.findFirst({
          where: {
            userId: mentorship.mentorId,
            type: 'Mentorship',
            title: { contains: mentorship.menteeId }
          }
        });
        
        if (mentorCpd) {
          await prisma.cPDActivity.update({
            where: { id: mentorCpd.id },
            data: {
              duration: mentorCpd.duration + meetingData.duration,
              points: mentorCpd.points + (meetingData.duration / 60), // 1 point per hour
              updatedAt: new Date()
            }
          });
        }
        
        // Update mentee's CPD record
        const menteeCpd = await prisma.cPDActivity.findFirst({
          where: {
            userId: mentorship.menteeId,
            type: 'Mentorship',
            title: { contains: mentorship.mentorId }
          }
        });
        
        if (menteeCpd) {
          await prisma.cPDActivity.update({
            where: { id: menteeCpd.id },
            data: {
              duration: menteeCpd.duration + meetingData.duration,
              points: menteeCpd.points + (meetingData.duration / 60), // 1 point per hour
              updatedAt: new Date()
            }
          });
        }
      }
    }
    
    return NextResponse.json(
      { message: 'Meeting updated successfully', meeting },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleAddResource(body) {
  try {
    const resourceData = resourceSchema.parse(body);
    
    // Check if mentorship exists
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: resourceData.mentorshipId }
    });
    
    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found' },
        { status: 404 }
      );
    }
    
    // Create resource
    const resource = await prisma.mentorshipResource.create({
      data: {
        ...resourceData,
        createdAt: new Date()
      }
    });
    
    return NextResponse.json(
      { message: 'Resource added successfully', resource },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid resource data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleAddFeedback(body) {
  try {
    const feedbackData = feedbackSchema.parse(body);
    
    // Check if mentorship exists
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: feedbackData.mentorshipId }
    });
    
    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found' },
        { status: 404 }
      );
    }
    
    // Create feedback
    const feedback = await prisma.mentorshipFeedback.create({
      data: {
        ...feedbackData,
        createdAt: new Date()
      }
    });
    
    return NextResponse.json(
      { message: 'Feedback added successfully', feedback },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid feedback data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateGoal(body) {
  try {
    const { mentorshipId, goalId, status } = body;
    
    if (!mentorshipId || !goalId || !status) {
      return NextResponse.json(
        { error: 'Mentorship ID, goal ID, and status are required' },
        { status: 400 }
      );
    }
    
    // Check if mentorship exists
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: mentorshipId }
    });
    
    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found' },
        { status: 404 }
      );
    }
    
    // Update goal status
    const goals = Array.isArray(mentorship.goals)
      ? mentorship.goals.map((goal) => {
          if (goal.id === goalId) {
            return { ...goal, status };
          }
          return goal;
        })
      : [];
    
    const updatedMentorship = await prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        goals,
        updatedAt: new Date()
      }
    });
    
    // If goal is completed, add to portfolio achievements
    if (status === 'completed') {
      // Get goal details
      const goal = Array.isArray(mentorship.goals)
        ? mentorship.goals.find((g) => g.id === goalId)
        : undefined;
      
      if (goal && typeof goal === 'object' && 'text' in goal) {
        // Add achievement to mentee's portfolio
        await prisma.portfolioAchievement.create({
          data: {
            userId: mentorship.menteeId,
            title: `Mentorship Goal: ${goal.text}`,
            description: `Completed mentorship goal with ${mentorship.mentorId}`,
            date: new Date().toISOString(),
            type: 'Mentorship',
            evidence: [],
            visibility: 'public',
            createdAt: new Date()
          }
        });
      }
    }
    
    return NextResponse.json(
      { message: 'Goal updated successfully', mentorship: updatedMentorship },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

async function handleCompleteMentorship(body) {
  try {
    const { mentorshipId, reflection } = body;
    
    if (!mentorshipId) {
      return NextResponse.json(
        { error: 'Mentorship ID is required' },
        { status: 400 }
      );
    }
    
    // Check if mentorship exists
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: mentorshipId }
    });
    
    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found' },
        { status: 404 }
      );
    }
    
    // Update mentorship status
    const updatedMentorship = await prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Update CPD records
    const mentorCpd = await prisma.cPDActivity.findFirst({
      where: {
        userId: mentorship.mentorId,
        type: 'Mentorship',
        title: { contains: mentorship.menteeId }
      }
    });
    
    if (mentorCpd) {
      await prisma.cPDActivity.update({
        where: { id: mentorCpd.id },
        data: {
          status: 'Completed',
          reflection: reflection || 'Mentorship completed successfully.',
          updatedAt: new Date()
        }
      });
    }
    
    const menteeCpd = await prisma.cPDActivity.findFirst({
      where: {
        userId: mentorship.menteeId,
        type: 'Mentorship',
        title: { contains: mentorship.mentorId }
      }
    });
    
    if (menteeCpd) {
      await prisma.cPDActivity.update({
        where: { id: menteeCpd.id },
        data: {
          status: 'Completed',
          reflection: reflection || 'Mentorship completed successfully.',
          updatedAt: new Date()
        }
      });
    }
    
    // Add to portfolio
    // For mentor
    await prisma.portfolioAchievement.create({
      data: {
        userId: mentorship.mentorId,
        title: `Completed Mentorship with ${mentorship.menteeId}`,
        description: `Successfully mentored ${mentorship.menteeId} focusing on ${mentorship.focusAreas.join(', ')}`,
        date: new Date().toISOString(),
        type: 'Mentorship',
        evidence: [],
        visibility: 'public',
        createdAt: new Date()
      }
    });
    
    // For mentee
    await prisma.portfolioAchievement.create({
      data: {
        userId: mentorship.menteeId,
        title: `Completed Mentorship with ${mentorship.mentorId}`,
        description: `Successfully completed mentorship with ${mentorship.mentorId} focusing on ${mentorship.focusAreas.join(', ')}`,
        date: new Date().toISOString(),
        type: 'Mentorship',
        evidence: [],
        visibility: 'public',
        createdAt: new Date()
      }
    });
    
    // Add reflection to portfolio
    if (reflection) {
      await prisma.portfolioReflection.create({
        data: {
          userId: mentorship.menteeId,
          title: `Reflection on Mentorship with ${mentorship.mentorId}`,
          content: reflection,
          date: new Date().toISOString(),
          tags: ['mentorship', 'professional development'],
          visibility: 'public',
          createdAt: new Date()
        }
      });
    }
    
    return NextResponse.json(
      { message: 'Mentorship completed successfully', mentorship: updatedMentorship },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type') || 'profile';
    const role = url.searchParams.get('role');
    const expertise = url.searchParams.get('expertise');
    const phase = url.searchParams.get('phase');
    const subject = url.searchParams.get('subject');
    
    if (!userId && type !== 'mentors' && type !== 'expertise') {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    switch (type) {
      case 'profile':
        return getProfile(userId!);
      case 'mentorships':
        return getMentorships(userId!, role);
      case 'requests':
        return getRequests(userId!, role);
      case 'meetings':
        return getMeetings(userId!);
      case 'mentors':
        return getMentors(expertise, phase, subject);
      case 'mentorship':
        const mentorshipId = url.searchParams.get('id');
        if (!mentorshipId) {
          return NextResponse.json(
            { error: 'Mentorship ID is required' },
            { status: 400 }
          );
        }
        return getMentorshipDetails(mentorshipId, userId!);
      case 'expertise':
        return getExpertiseAreas();
      case 'analytics':
        return getMentorshipAnalytics(userId!);
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in mentor matching API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getProfile(userId: string) {
  const profile = await prisma.mentorProfile.findUnique({
    where: { userId }
  });
  
  return NextResponse.json({ profile: profile || { userId } }, { status: 200 });
}

async function getMentorships(userId: string, role: string | null) {
  const where = role === 'mentor' 
    ? { mentorId: userId }
    : role === 'mentee'
    ? { menteeId: userId }
    : { OR: [{ mentorId: userId }, { menteeId: userId }] };
  
  const mentorships = await prisma.mentorship.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ mentorships }, { status: 200 });
}

async function getRequests(userId: string, role: string | null) {
  const where = role === 'mentor' 
    ? { mentorId: userId }
    : role === 'mentee'
    ? { menteeId: userId }
    : { OR: [{ mentorId: userId }, { menteeId: userId }] };
  
  const requests = await prisma.mentorshipRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ requests }, { status: 200 });
}

async function getMeetings(userId: string) {
  // Get all mentorships for the user
  const mentorships = await prisma.mentorship.findMany({
    where: {
      OR: [{ mentorId: userId }, { menteeId: userId }]
    },
    select: { id: true }
  });
  
  const mentorshipIds = mentorships.map((m) => m.id);
  
  // Get meetings for these mentorships
  const meetings = await prisma.mentorshipMeeting.findMany({
    where: {
      mentorshipId: { in: mentorshipIds }
    },
    orderBy: { date: 'asc' }
  });
  
  return NextResponse.json({ meetings }, { status: 200 });
}

async function getMentors(expertise: string | null, phase: string | null, subject: string | null) {
  const where = { role: { in: ['mentor', 'both'] } };
  
  if (expertise) {
    where.expertise = { has: parseInt(expertise) };
  }
  
  if (phase) {
    where.phase = phase;
  }
  
  if (subject) {
    where.subjects = { has: subject };
  }
  
  const mentors = await prisma.mentorProfile.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ mentors }, { status: 200 });
}

async function getMentorshipDetails(mentorshipId: string, userId: string) {
  // Get mentorship
  const mentorship = await prisma.mentorship.findUnique({
    where: { id: mentorshipId }
  });
  
  if (!mentorship) {
    return NextResponse.json(
      { error: 'Mentorship not found' },
      { status: 404 }
    );
  }
  
  // Check if user is part of this mentorship
  if (mentorship.mentorId !== userId && mentorship.menteeId !== userId) {
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }
  
  // Get meetings
  const meetings = await prisma.mentorshipMeeting.findMany({
    where: { mentorshipId },
    orderBy: { date: 'asc' }
  });
  
  // Get resources
  const resources = await prisma.mentorshipResource.findMany({
    where: { mentorshipId },
    orderBy: { createdAt: 'desc' }
  });
  
  // Get feedback
  const feedback = await prisma.mentorshipFeedback.findMany({
    where: { mentorshipId },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ 
    mentorship,
    meetings,
    resources,
    feedback
  }, { status: 200 });
}

async function getExpertiseAreas() {
  // In a real implementation, this would come from a database
  const expertiseAreas = [
    { id: 1, name: "Special Educational Needs", category: "Inclusion" },
    { id: 2, name: "Behaviour Management", category: "Classroom Management" },
    { id: 3, name: "Curriculum Design", category: "Teaching & Learning" },
    { id: 4, name: "Assessment for Learning", category: "Assessment" },
    { id: 5, name: "Differentiation", category: "Teaching & Learning" },
    { id: 6, name: "Digital Learning", category: "EdTech" },
    { id: 7, name: "Early Years Education", category: "Phase Specific" },
    { id: 8, name: "Secondary Mathematics", category: "Subject Specific" },
    { id: 9, name: "Leadership Development", category: "Leadership" },
    { id: 10, name: "Wellbeing & Mental Health", category: "Pastoral" },
    { id: 11, name: "Restorative Practise", category: "Behaviour" },
    { id: 12, name: "Literacy Across Curriculum", category: "Literacy" },
    { id: 13, name: "STEM Integration", category: "Cross-Curricular" },
    { id: 14, name: "Educational Research", category: "Professional Learning" },
    { id: 15, name: "Parent Engagement", category: "Community" }
  ];
  
  return NextResponse.json({ expertiseAreas }, { status: 200 });
}

async function getMentorshipAnalytics(userId: string) {
  // Get all mentorships for the user
  const mentorMentorships = await prisma.mentorship.findMany({
    where: { mentorId: userId }
  });
  
  const menteeMentorships = await prisma.mentorship.findMany({
    where: { menteeId: userId }
  });
  
  // Calculate statistics
  const activeMentorships = [...mentorMentorships, ...menteeMentorships].filter(m => m.status === 'active').length;
  const completedMentorships = [...mentorMentorships, ...menteeMentorships].filter(m => m.status === 'completed').length;
  
  // Get all meetings
  const mentorshipIds = [...mentorMentorships, ...menteeMentorships].map((m) => m.id);
  
  const meetings = await prisma.mentorshipMeeting.findMany({
    where: {
      mentorshipId: { in: mentorshipIds }
    }
  });
  
  const completedMeetings = meetings.filter(m => m.status === 'completed').length;
  const totalMeetingHours = meetings
    .filter(m => m.status === 'completed')
    .reduce((total, meeting) => total + meeting.duration / 60, 0);
  
  // Get all goals
  const allGoals = [...mentorMentorships, ...menteeMentorships].flatMap(m =>
    Array.isArray(m.goals) ? m.goals : []
  );
  const completedGoals = allGoals.filter((g) => g && g.status === 'completed').length;
  const inProgressGoals = allGoals.filter((g) => g && g.status === 'in_progress').length;
  
  // Get CPD points from mentorship
  const cpdActivities = await prisma.cPDActivity.findMany({
    where: {
      userId,
      type: 'Mentorship'
    }
  });
  
  const totalCpdPoints = cpdActivities.reduce((total, activity) => total + activity.points, 0);
  
  // Get expertise distribution
  const expertiseDistribution = mentorMentorships.reduce((acc, mentorship) => {
    mentorship.focusAreas.forEach(area => {
      if (!acc[area]) {
        acc[area] = 0;
      }
      acc[area]++;
    });
    return acc;
  }, {} as Record<number, number>);
  
  // Monthly activity data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - 11 + i);
    const monthStr = month.toLocaleString('default', { month: 'short' });
    
    const monthMeetings = meetings.filter(m => {
      const meetingDate = new Date(m.date);
      return meetingDate.getMonth() === month.getMonth() && 
             meetingDate.getFullYear() === month.getFullYear() &&
             m.status === 'completed';
    }).length;
    
    return {
      month: monthStr,
      meetings: monthMeetings
    };
  });
  
  return NextResponse.json({ 
    overview: {
      activeMentorships,
      completedMentorships,
      completedMeetings,
      totalMeetingHours,
      completedGoals,
      inProgressGoals,
      totalCpdPoints
    },
    expertiseDistribution,
    monthlyData
  }, { status: 200 });
}
