import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook data for debugging
    console.log('HeyGen webhook received:', {
      timestamp: new Date().toISOString(),
      data: body
    });

    // Validate webhook signature if HeyGen provides one
    const signature = request.headers.get('x-heygen-signature');
    if (signature) {
      // TODO: Implement signature validation when HeyGen provides webhook signing
      // const isValid = validateWebhookSignature(body, signature);
      // if (!isValid) {
      //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      // }
    }

    // Handle different webhook event types
    switch (body.event_type || body.type) {
      case 'streaming.session_created':
        await handleSessionCreated(body);
        break;
      
      case 'streaming.session_ready':
        await handleSessionReady(body);
        break;
      
      case 'streaming.avatar_response':
        await handleAvatarResponse(body);
        break;
      
      case 'streaming.session_ended':
        await handleSessionEnded(body);
        break;
      
      case 'streaming.error':
        await handleStreamingError(body);
        break;
      
      default:
        console.log('Unknown webhook event type:', body.event_type || body.type);
    }

    return NextResponse.json({ status: 'success', received: true });

  } catch (error) {
    console.error('Error processing HeyGen webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSessionCreated(data: any) {
  console.log('Streaming session created:', {
    session_id: data.session_id,
    avatar_id: data.avatar_id,
    status: data.status
  });
  
  // TODO: Store session information in database if needed
  // await db.streamingSessions.create({
  //   data: {
  //     sessionId: data.session_id,
  //     avatarId: data.avatar_id,
  //     status: 'created',
  //     createdAt: new Date()
  //   }
  // });
}

async function handleSessionReady(data: any) {
  console.log('Streaming session ready:', {
    session_id: data.session_id,
    websocket_url: data.websocket_url
  });
  
  // TODO: Update session status in database
  // await db.streamingSessions.update({
  //   where: { sessionId: data.session_id },
  //   data: { status: 'ready', websocketUrl: data.websocket_url }
  // });
}

async function handleAvatarResponse(data: any) {
  console.log('Avatar response received:', {
    session_id: data.session_id,
    text: data.text,
    audio_url: data.audio_url,
    video_url: data.video_url,
    duration: data.duration
  });
  
  // TODO: Store avatar response for conversation history
  // await db.avatarResponses.create({
  //   data: {
  //     sessionId: data.session_id,
  //     text: data.text,
  //     audioUrl: data.audio_url,
  //     videoUrl: data.video_url,
  //     duration: data.duration,
  //     timestamp: new Date()
  //   }
  // });
}

async function handleSessionEnded(data: any) {
  console.log('Streaming session ended:', {
    session_id: data.session_id,
    reason: data.reason,
    duration: data.duration
  });
  
  // TODO: Update session status and cleanup
  // await db.streamingSessions.update({
  //   where: { sessionId: data.session_id },
  //   data: { 
  //     status: 'ended', 
  //     endedAt: new Date(),
  //     endReason: data.reason,
  //     totalDuration: data.duration
  //   }
  // });
}

async function handleStreamingError(data: any) {
  console.error('Streaming error:', {
    session_id: data.session_id,
    error_code: data.error_code,
    error_message: data.error_message
  });
  
  // TODO: Update session status and log error
  // await db.streamingSessions.update({
  //   where: { sessionId: data.session_id },
  //   data: { 
  //     status: 'error',
  //     errorCode: data.error_code,
  //     errorMessage: data.error_message,
  //     errorAt: new Date()
  //   }
  // });
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'HeyGen webhook endpoint',
      status: 'active',
      timestamp: new Date().toISOString()
    }
  );
}

