import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    
    // Build query
    const query = {
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            yearGroup: true,
            supportNeeds: true
          }
        },
        attachments: true
      }
    };
    
    // Add student filter if provided
    if (studentId) {
      query.where.studentId = studentId;
    }
    
    // Fetch messages
    const messages = await prisma.communicationMessage.findMany(query);
    
    return NextResponse.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get message data from request body
    const { message } = await req.json();
    
    if (!message || !message.content || !message.recipientId || !message.studentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required message data' },
        { status: 400 }
      );
    }
    
    // Create new message
    const newMessage = await prisma.communicationMessage.create({
      data: {
        content: message.content,
        senderId: userId,
        recipientId: message.recipientId,
        studentId: message.studentId,
        urgent: message.urgent || false,
        read: false,
        attachments: {
          create: message.attachments?.map((attachment) => ({
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            url: attachment.url
          })) || []
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            yearGroup: true,
            supportNeeds: true
          }
        },
        attachments: true
      }
    });
    
    // Log the communication activity
    await prisma.communicationLog.create({
      data: {
        userId,
        action: 'message_sent',
        details: JSON.stringify({
          messageId: newMessage.id,
          recipientId: message.recipientId,
          studentId: message.studentId
        })
      }
    });
    
    // Check if notifications are enabled for recipient
    const recipientSettings = await prisma.communicationSettings.findUnique({
      where: {
        userId: message.recipientId
      }
    });
    
    // Handle notifications based on recipient settings
    if (recipientSettings?.emailNotifications) {
      // In a real implementation, this would send an email notification
      console.log(`Email notification would be sent to recipient ${message.recipientId}`);
    }
    
    if (recipientSettings?.smsNotifications && message.urgent) {
      // In a real implementation, this would send an SMS for urgent messages
      console.log(`SMS notification would be sent to recipient ${message.recipientId} for urgent message`);
    }
    
    return NextResponse.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
