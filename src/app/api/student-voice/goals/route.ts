import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for goal request
const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["academic", "social", "behavioural", "personal"]),
  dueDate: z.string().datetime(),
  studentId: z.string(),
  milestones: z.array(
    z.object({
      title: z.string().min(3, "Milestone title must be at least 3 characters"),
      description: z.string().optional(),
    })
  ).min(1, "At least one milestone is required"),
  collaborators: z.array(
    z.object({
      userId: z.string(),
      role: z.enum(["student", "teacher", "parent", "other"]),
    })
  ).optional(),
});

// Define schema for milestone update request
const milestoneUpdateSchema = z.object({
  goalId: z.string(),
  milestoneId: z.string(),
  completed: z.boolean(),
  completedAt: z.string().datetime().optional(),
});

// Define schema for goal reflection request
const goalReflectionSchema = z.object({
  content: z.string().min(1, "Reflection content cannot be empty"),
  goalId: z.string(),
  createdBy: z.string(),
});

// Mock goals data
const mockGoals = [
  {
    id: "1",
    title: "Improve my public speaking skills",
    description: "Become more confident when presenting to the class and participate more in discussions",
    category: "personal",
    status: "active",
    progress: 40,
    dueDate: "2025-07-15T00:00:00Z",
    studentId: "student123",
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-05-10T14:30:00Z",
    milestones: [
      { 
        id: "1-1", 
        title: "Volunteer to answer at least once per lesson", 
        description: null,
        completed: true,
        completedAt: "2025-04-02T15:30:00Z"
      },
      { 
        id: "1-2", 
        title: "Present to a small group of classmates", 
        description: null,
        completed: true,
        completedAt: "2025-04-18T13:45:00Z"
      },
      { 
        id: "1-3", 
        title: "Lead a class discussion", 
        description: null,
        completed: false,
        completedAt: null
      },
      { 
        id: "1-4", 
        title: "Give a presentation to the whole class", 
        description: null,
        completed: false,
        completedAt: null
      }
    ],
    collaborators: [
      { userId: "student123", role: "student" },
      { userId: "teacher456", role: "teacher" },
      { userId: "parent789", role: "parent" }
    ]
  },
  {
    id: "2",
    title: "Master multiplication tables up to 12",
    description: "Learn all multiplication facts to improve my mental math skills",
    category: "academic",
    status: "active",
    progress: 75,
    dueDate: "2025-06-01T00:00:00Z",
    studentId: "student123",
    createdAt: "2025-02-10T09:15:00Z",
    updatedAt: "2025-05-05T11:20:00Z",
    milestones: [
      { 
        id: "2-1", 
        title: "Learn tables 1-5", 
        description: null,
        completed: true,
        completedAt: "2025-03-01T16:00:00Z"
      },
      { 
        id: "2-2", 
        title: "Learn tables 6-9", 
        description: null,
        completed: true,
        completedAt: "2025-04-05T14:30:00Z"
      },
      { 
        id: "2-3", 
        title: "Learn tables 10-12", 
        description: null,
        completed: true,
        completedAt: "2025-05-01T15:45:00Z"
      },
      { 
        id: "2-4", 
        title: "Complete timed test with 90% accuracy", 
        description: null,
        completed: false,
        completedAt: null
      }
    ],
    collaborators: [
      { userId: "student123", role: "student" },
      { userId: "teacher456", role: "teacher" }
    ]
  }
];

// Mock goal reflections data
const mockReflections = [
  {
    id: "r1",
    content: "I've been practicing speaking up in class more often. It's still a bit scary, but I'm getting more comfortable each time.",
    goalId: "1",
    createdBy: "student123",
    createdAt: "2025-05-01T14:30:00Z",
    authorName: "Jamie Smith",
    authorRole: "Student"
  },
  {
    id: "r2",
    content: "Jamie has shown great improvement in class participation. I've noticed increased confidence when answering questions.",
    goalId: "1",
    createdBy: "teacher456",
    createdAt: "2025-05-05T09:15:00Z",
    authorName: "Ms. Johnson",
    authorRole: "Teacher"
  },
  {
    id: "r3",
    content: "We've been practicing presentations at home. Jamie is working hard on making eye contact and speaking clearly.",
    goalId: "1",
    createdBy: "parent789",
    createdAt: "2025-05-10T19:45:00Z",
    authorName: "Mr. Smith",
    authorRole: "Parent"
  }
];

// GET handler for retrieving data
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const studentId = searchParams.get('studentId');
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  
  // Return goal by ID
  if (id) {
    const goal = mockGoals.find(g => g.id === id);
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    // Get reflections for this goal
    const goalReflections = mockReflections.filter(r => r.goalId === id);
    
    return NextResponse.json({ 
      goal,
      reflections: goalReflections
    });
  }
  
  // Filter goals based on query parameters
  let filteredGoals = [...mockGoals];
  
  if (studentId) {
    filteredGoals = filteredGoals.filter(g => g.studentId === studentId);
  }
  
  if (status) {
    filteredGoals = filteredGoals.filter(g => g.status === status);
  }
  
  if (category) {
    filteredGoals = filteredGoals.filter(g => g.category === category);
  }
  
  return NextResponse.json({ goals: filteredGoals });
}

// POST handler for creating new data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body.type;
    
    switch (type) {
      case 'goal':
        const goalData = goalSchema.parse(body);
        
        // Create milestones with IDs
        const milestones = goalData.milestones.map((milestone, index) => ({
          id: `new-${index + 1}`,
          title: milestone.title,
          description: milestone.description || null,
          completed: false,
          completedAt: null
        }));
        
        // Calculate initial progress (0% as no milestones completed yet)
        const progress = 0;
        
        const newGoal = {
          id: Date.now().toString(),
          ...goalData,
          status: "active",
          progress,
          milestones,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({ 
          success: true, 
          message: "Goal created successfully", 
          goal: newGoal 
        });
        
      case 'milestone-update':
        const milestoneData = milestoneUpdateSchema.parse(body);
        
        // In a real implementation, this would update the database
        // For now, we'll just return a success response
        return NextResponse.json({ 
          success: true, 
          message: "Milestone updated successfully", 
          milestoneUpdate: {
            ...milestoneData,
            completedAt: milestoneData.completed ? (milestoneData.completedAt || new Date().toISOString()) : null
          }
        });
        
      case 'reflection':
        const reflectionData = goalReflectionSchema.parse(body);
        
        // In a real implementation, we would look up user details
        // For now, we'll use mock data
        const authorDetails = {
          "student123": { name: "Jamie Smith", role: "Student" },
          "teacher456": { name: "Ms. Johnson", role: "Teacher" },
          "parent789": { name: "Mr. Smith", role: "Parent" }
        };
        
        const author = authorDetails[reflectionData.createdBy] || { name: "Unknown User", role: "Other" };
        
        const newReflection = {
          id: Date.now().toString(),
          ...reflectionData,
          createdAt: new Date().toISOString(),
          authorName: author.name,
          authorRole: author.role
        };
        
        return NextResponse.json({ 
          success: true, 
          message: "Reflection added successfully", 
          reflection: newReflection 
        });
        
      default:
        return NextResponse.json({ 
          success: false, 
          message: "Invalid type parameter" 
        }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "An error occurred while processing your request" 
    }, { status: 500 });
  }
}

// PUT handler for updating existing data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type } = body;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: "ID is required for updates" 
      }, { status: 400 });
    }
    
    switch (type) {
      case 'goal':
        const goalData = goalSchema.parse(body);
        
        // In a real implementation, this would update the database
        // For now, we'll just return a success response
        const updatedGoal = {
          id,
          ...goalData,
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({ 
          success: true, 
          message: "Goal updated successfully", 
          goal: updatedGoal 
        });
        
      case 'goal-status':
        const { status } = body;
        if (!status || !['active', 'achieved', 'abandoned'].includes(status)) {
          return NextResponse.json({ 
            success: false, 
            message: "Invalid status value" 
          }, { status: 400 });
        }
        
        // In a real implementation, this would update the database
        // For now, we'll just return a success response
        const statusUpdatedGoal = {
          id,
          status,
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({ 
          success: true, 
          message: "Goal status updated successfully", 
          goal: statusUpdatedGoal 
        });
        
      default:
        return NextResponse.json({ 
          success: false, 
          message: "Invalid type parameter" 
        }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "An error occurred while processing your request" 
    }, { status: 500 });
  }
}
