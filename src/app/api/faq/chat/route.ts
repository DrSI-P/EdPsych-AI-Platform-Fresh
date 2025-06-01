import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for chat message
const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  sessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const validatedData = chatMessageSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }
    
    // If sessionId is provided, check if it exists and belongs to the user
    let chatSession;
    if (validatedData.data.sessionId) {
      chatSession = await prisma.fAQChatSession.findUnique({
        where: {
          id: validatedData.data.sessionId,
          userId: session.user.id,
        },
      });
      
      if (!chatSession) {
        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
      }
    } else {
      // Create new chat session
      chatSession = await prisma.fAQChatSession.create({
        data: {
          userId: session.user.id,
          title: validatedData.data.content.slice(0, 50) + (validatedData.data.content.length > 50 ? '...' : ''),
        },
      });
    }
    
    // Search for relevant FAQs to provide context
    const relevantFAQs = await findRelevantFAQs(validatedData.data.content);
    
    // Add user message to chat history
    await prisma.fAQChatMessage.create({
      data: {
        sessionId: chatSession.id,
        content: validatedData.data.content,
        role: 'user',
        referencedFAQs: relevantFAQs.map(faq => faq.id),
      },
    });
    
    // Add context from FAQs if available
    if (relevantFAQs.length > 0) {
      const faqContext = relevantFAQs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
      
      // Prepare system message with FAQ context
      const systemMessage = {
        role: 'system',
        content: `You are a helpful assistant for the EdPsych Connect platform. Use the following FAQ information to help answer the user's question. If the FAQ doesn't contain relevant information, provide a helpful response based on general knowledge about educational psychology and special educational needs.

FAQ Context:
${faqContext}`,
      };
      
      // Generate AI response
      const aiResponse = await generateChatResponse(systemMessage, validatedData.data.content);
      
      // Add AI response to chat history
      await prisma.fAQChatMessage.create({
        data: {
          sessionId: chatSession.id,
          content: aiResponse,
          role: 'assistant',
          referencedFAQs: relevantFAQs.map(faq => faq.id),
        },
      });
      
      return NextResponse.json({
        message: aiResponse,
        sessionId: chatSession.id,
        referencedFAQs: relevantFAQs,
      });
    } else {
      // No relevant FAQs found, provide a generic response
      const genericResponse = "I don't have specific information about that in my FAQ database. Could you provide more details or ask about another topic related to educational psychology or special educational needs?";
      
      // Add generic response to chat history
      await prisma.fAQChatMessage.create({
        data: {
          sessionId: chatSession.id,
          content: genericResponse,
          role: 'assistant',
          referencedFAQs: [],
        },
      });
      
      return NextResponse.json({
        message: genericResponse,
        sessionId: chatSession.id,
        referencedFAQs: [],
      });
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

// Helper function to find relevant FAQs based on user query
async function findRelevantFAQs(query: string) {
  try {
    // Extract keywords from query
    const keywords = query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    if (keywords.length === 0) {
      return [];
    }
    
    const faqs = await prisma.fAQQuestion.findMany({
      where: {
        isPublished: true,
        OR: keywords.map(keyword => ({
          OR: [
            { question: { contains: keyword, mode: 'insensitive' } },
            { answer: { contains: keyword, mode: 'insensitive' } },
            { keywords: { has: keyword } },
          ],
        })),
      },
      orderBy: { viewCount: 'desc' },
      take: 3,
    });
    
    return faqs;
  } catch (error) {
    console.error('Error finding relevant FAQs:', error);
    return [];
  }
}

// Helper function to generate chat response using AI
async function generateChatResponse(systemMessage, userMessage: string) {
  // This is a placeholder for the actual AI integration
  // In a real implementation, this would call an AI service like OpenAI
  return `Based on our FAQ information, I can help with that. ${userMessage.includes('?') ? '' : 'Could you provide more specific details about what you need to know?'}`;
}
