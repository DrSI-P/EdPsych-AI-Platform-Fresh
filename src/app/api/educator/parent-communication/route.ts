import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Schema for sending a communication
const sendCommunicationSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  recipientIds: z.array(z.string()).min(1, "At least one recipient is required"),
  language: z.string().default("en"),
  scheduledDate: z.string().optional(),
  templateId: z.string().optional(),
  communicationType: z.enum(["email", "sms", "app_notification", "letter"]),
  attachments: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Schema for retrieving communication history
const getCommunicationHistorySchema = z.object({
  studentId: z.string().optional(),
  parentId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.enum(["email", "sms", "app_notification", "letter"]).optional(),
  status: z.enum(["sent", "delivered", "read", "responded"]).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Schema for creating a template
const createTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

// Schema for analytics request
const getAnalyticsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  groupBy: z.enum(["day", "week", "month"]).default("day"),
  metrics: z.array(
    z.enum([
      "total_sent", 
      "response_rate", 
      "average_response_time", 
      "category_distribution",
      "engagement_score"
    ])
  ).default(["total_sent", "response_rate"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorised" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { action } = body;
    
    switch (action) {
      case "send_communication":
        return handleSendCommunication(body, session);
      case "get_history":
        return handleGetHistory(body, session);
      case "create_template":
        return handleCreateTemplate(body, session);
      case "get_templates":
        return handleGetTemplates(body, session);
      case "get_analytics":
        return handleGetAnalytics(body, session);
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in parent communication API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSendCommunication(body: any, session: any) {
  try {
    const { subject, content, recipientIds, language, scheduledDate, templateId, communicationType, attachments, metadata } = 
      sendCommunicationSchema.parse(body);
    
    // In a real implementation, this would:
    // 1. Validate that the user has permission to contact these recipients
    // 2. Process any template variables
    // 3. Handle translation if needed
    // 4. Schedule for later delivery if scheduledDate is provided
    // 5. Store the communication in the database
    // 6. Send via the appropriate channel (email, SMS, etc.)
    
    // For now, we'll simulate success
    const communicationIds = recipientIds.map((recipientId, index) => `comm_${Date.now()}_${index}`);
    
    return NextResponse.json({
      success: true,
      message: `Communication ${scheduledDate ? 'scheduled' : 'sent'} successfully`,
      communicationIds,
      scheduledDate: scheduledDate || null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    throw error;
  }
}

async function handleGetHistory(body: any, session: any) {
  try {
    const { studentId, parentId, startDate, endDate, type, status, limit, offset } = 
      getCommunicationHistorySchema.parse(body);
    
    // In a real implementation, this would:
    // 1. Query the database for communications matching the filters
    // 2. Apply pagination
    // 3. Return the results
    
    // For now, we'll return mock data
    const mockCommunications = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: `comm_${Date.now()}_${i}`,
      subject: `Sample Communication ${i + 1}`,
      content: "This is a sample communication content.",
      sentAt: new Date(Date.now() - i * 86400000).toISOString(), // Each one day earlier
      type: type || "email",
      status: status || "sent",
      recipientId: studentId || parentId || `recipient_${i}`,
      recipientName: `Recipient ${i + 1}`,
      hasResponse: Math.random() > 0.3, // 70% chance of having a response
      responseTime: Math.random() > 0.3 ? Math.floor(Math.random() * 24 * 60) : null, // Response time in minutes
    }));
    
    return NextResponse.json({
      communications: mockCommunications,
      total: 42, // Mock total count
      limit,
      offset,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    throw error;
  }
}

async function handleCreateTemplate(body: any, session: any) {
  try {
    const { title, content, category, tags, isPublic } = 
      createTemplateSchema.parse(body);
    
    // In a real implementation, this would:
    // 1. Store the template in the database
    // 2. Associate it with the user or make it public
    
    // For now, we'll simulate success
    const templateId = `template_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: "Template created successfully",
      templateId,
      template: {
        id: templateId,
        title,
        content,
        category,
        tags: tags || [],
        isPublic,
        createdAt: new Date().toISOString(),
        createdBy: session.user.id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    throw error;
  }
}

async function handleGetTemplates(body: any, session: any) {
  // In a real implementation, this would:
  // 1. Query the database for templates
  // 2. Filter by category, search term, etc.
  // 3. Apply pagination
  
  // For now, we'll return mock data
  const mockTemplates = [
    {
      id: "template_1",
      title: "Positive Academic Progress",
      content: "Dear [Parent/Guardian],\n\nI am writing to share some positive news about [Student]'s academic progress...",
      category: "academic",
      tags: ["positive", "progress", "achievement"],
      isPublic: true,
      createdAt: new Date().toISOString(),
      createdBy: "system",
    },
    {
      id: "template_2",
      title: "Academic Support Needed",
      content: "Dear [Parent/Guardian],\n\nI am writing regarding [Student]'s recent performance in [Subject]...",
      category: "academic",
      tags: ["support", "intervention", "collaboration"],
      isPublic: true,
      createdAt: new Date().toISOString(),
      createdBy: "system",
    },
    {
      id: "template_3",
      title: "Behaviour Concern - Restorative Approach",
      content: "Dear [Parent/Guardian],\n\nI am writing regarding a situation that occurred at school involving [Student]...",
      category: "behaviour",
      tags: ["concern", "restorative", "reflection"],
      isPublic: true,
      createdAt: new Date().toISOString(),
      createdBy: "system",
    },
  ];
  
  return NextResponse.json({
    templates: mockTemplates,
    total: mockTemplates.length,
  });
}

async function handleGetAnalytics(body: any, session: any) {
  try {
    const { startDate, endDate, groupBy, metrics } = 
      getAnalyticsSchema.parse(body);
    
    // In a real implementation, this would:
    // 1. Query the database for analytics data
    // 2. Aggregate based on groupBy
    // 3. Calculate the requested metrics
    
    // For now, we'll return mock data
    const today = new Date();
    const mockData = {
      timePoints: Array.from({ length: 14 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (13 - i));
        return date.toISOString().split('T')[0];
      }),
      metrics: {
        total_sent: Array.from({ length: 14 }, () => Math.floor(Math.random() * 20)),
        response_rate: Array.from({ length: 14 }, () => Math.floor(40 + Math.random() * 60)),
        average_response_time: Array.from({ length: 14 }, () => Math.floor(60 + Math.random() * 240)),
        category_distribution: {
          academic: 35,
          behaviour: 25,
          attendance: 15,
          events: 10,
          meetings: 8,
          general: 5,
          sen: 2,
        },
        engagement_score: 67,
      },
      summary: {
        total_communications: 124,
        average_response_rate: 67,
        average_response_time: 252, // minutes
        most_common_category: "academic",
        least_engaged_count: 5,
        highly_engaged_count: 12,
      }
    };
    
    return NextResponse.json({
      analytics: mockData,
      period: {
        start: startDate || mockData.timePoints[0],
        end: endDate || mockData.timePoints[mockData.timePoints.length - 1],
        groupBy,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorised" },
        { status: 401 }
      );
    }
    
    // Handle GET requests for templates
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    
    switch (action) {
      case "get_templates":
        return handleGetTemplates({}, session);
      case "get_analytics":
        return handleGetAnalytics({
          startDate: url.searchParams.get("startDate") || undefined,
          endDate: url.searchParams.get("endDate") || undefined,
          groupBy: url.searchParams.get("groupBy") || "day",
        }, session);
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in parent communication API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
