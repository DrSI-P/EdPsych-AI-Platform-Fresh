import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema for meeting note transcription request
const meetingNoteRequestSchema = z.object({
  title: z.string(),
  type: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
  language: z.string(),
  audioData: z.string().optional(), // Base64 encoded audio data
  audioFileUrl: z.string().optional(), // URL to audio file
  studentYear: z.number().optional(), // Student year for age-appropriate processing
  ehcnaFocus: z.boolean().optional(), // Whether to focus on EHCNA categories
  preparationForAdulthood: z.boolean().optional(), // Whether to focus on preparation for adulthood (Year 9+)
});

// Schema for meeting note response
const meetingNoteResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
  language: z.string(),
  transcript: z.string(),
  keyPoints: z.array(z.object({
    text: z.string(),
    category: z.string(),
    ehcnaArea: z.string().optional(), // Communication, Cognition, SEMH, Sensory/Physical
    preparationForAdulthood: z.boolean().optional(),
    highlighted: z.boolean(),
  })),
  actionItems: z.array(z.object({
    text: z.string(),
    assignedTo: z.string(),
    dueDate: z.string(),
    completed: z.boolean(),
    ehcnaArea: z.string().optional(),
  })),
  tags: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = meetingNoteRequestSchema.parse(body);
    
    // In a real implementation, this would:
    // 1. Process the audio data using speech-to-text
    // 2. Use AI to extract key points and categorize them
    // 3. Generate action items
    // 4. Save the meeting note to the database
    
    // For now, we'll return a mock response
    const meetingId = `meeting-${Date.now()}`;
    
    // Determine if we should apply EHCNA categorization and preparation for adulthood focus
    const useEhcnaCategories = validatedData.ehcnaFocus ?? false;
    const usePreparationForAdulthood = validatedData.preparationForAdulthood ?? 
                                      (validatedData.studentYear && validatedData.studentYear >= 9) ?? false;
    
    // Mock response with EHCNA categories if requested
    const response = {
      id: meetingId,
      title: validatedData.title,
      type: validatedData.type,
      date: validatedData.date,
      participants: validatedData.participants,
      language: validatedData.language,
      transcript: "This is a sample transcript that would be generated from the audio recording.",
      keyPoints: [
        {
          text: "Student shows strong verbal communication skills in one-to-one settings",
          category: "strength",
          ehcnaArea: useEhcnaCategories ? "Communication and Interaction" : undefined,
          highlighted: true,
        },
        {
          text: "Student struggles with processing complex written instructions",
          category: "development",
          ehcnaArea: useEhcnaCategories ? "Cognition and Learning" : undefined,
          highlighted: true,
        },
        {
          text: "Student demonstrates anxiety in group situations",
          category: "concern",
          ehcnaArea: useEhcnaCategories ? "Social, Emotional and Mental Health" : undefined,
          highlighted: true,
        },
        {
          text: "Student benefits from movement breaks during extended desk work",
          category: "strategy",
          ehcnaArea: useEhcnaCategories ? "Sensory and Physical" : undefined,
          highlighted: false,
        }
      ],
      actionItems: [
        {
          text: "Provide visual supports for complex instructions",
          assignedTo: "Class Teacher",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          ehcnaArea: useEhcnaCategories ? "Cognition and Learning" : undefined,
        },
        {
          text: "Schedule weekly check-in with school counselor",
          assignedTo: "SENCO",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          ehcnaArea: useEhcnaCategories ? "Social, Emotional and Mental Health" : undefined,
        }
      ],
      tags: ["Meeting Notes", validatedData.type],
    };
    
    // Add preparation for adulthood key points if applicable
    if (usePreparationForAdulthood) {
      response.keyPoints.push({
        text: "Student expresses interest in pursuing a career in technology",
        category: "interest",
        ehcnaArea: "Preparation for Adulthood - Employment",
        highlighted: true,
      });
      
      response.keyPoints.push({
        text: "Student needs support with independent travel planning",
        category: "development",
        ehcnaArea: "Preparation for Adulthood - Independent Living",
        highlighted: true,
      });
      
      response.actionItems.push({
        text: "Arrange work experience placement in local tech company",
        assignedTo: "Careers Advisor",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        ehcnaArea: "Preparation for Adulthood - Employment",
      });
      
      response.tags.push("Preparation for Adulthood");
    }
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error('Error processing meeting note:', error);
    return NextResponse.json({ error: 'Failed to process meeting note' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search');
    const meetingType = url.searchParams.get('type');
    
    // In a real implementation, we would fetch meeting notes from the database
    // For now, we'll return mock data
    const meetings = [
      {
        id: 'meeting-123456',
        title: 'Annual Review Meeting - Alex Johnson',
        type: 'iep-meeting',
        date: new Date().toISOString(),
        participants: ['Ms. Smith (SENCO)', 'Mr. Johnson (Parent)', 'Mrs. Johnson (Parent)', 'Dr. Williams (Educational Psychologist)'],
        language: 'en-GB',
        transcript: "This is a sample transcript of the annual review meeting.",
        keyPoints: [
          {
            text: "Alex has made significant progress in reading comprehension",
            category: "strength",
            ehcnaArea: "Cognition and Learning",
            highlighted: true,
          },
          {
            text: "Alex continues to struggle with peer relationships during unstructured time",
            category: "development",
            ehcnaArea: "Social, Emotional and Mental Health",
            highlighted: true,
          }
        ],
        actionItems: [
          {
            text: "Implement social skills group intervention",
            assignedTo: "SENCO",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
            ehcnaArea: "Social, Emotional and Mental Health",
          }
        ],
        tags: ['Annual Review', 'IEP Meeting', 'Year 7'],
      }
    ];
    
    // Filter by search query if provided
    let filteredMeetings = meetings;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredMeetings = meetings.filter(meeting => 
        meeting.title.toLowerCase().includes(query) ||
        meeting.transcript.toLowerCase().includes(query) ||
        meeting.keyPoints.some(kp => kp.text.toLowerCase().includes(query)) ||
        meeting.actionItems.some(ai => ai.text.toLowerCase().includes(query)) ||
        meeting.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by meeting type if provided
    if (meetingType) {
      filteredMeetings = filteredMeetings.filter(meeting => meeting.type === meetingType);
    }
    
    return NextResponse.json(filteredMeetings);
  } catch (error) {
    console.error('Error fetching meeting notes:', error);
    return NextResponse.json({ error: 'Failed to fetch meeting notes' }, { status: 500 });
  }
}
