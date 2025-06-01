/**
 * HEYGEN API Webhook Handler
 * 
 * This API route handles webhook callbacks from the HEYGEN API
 * for video generation status updates.
 */

import { NextRequest, NextResponse } from 'next/server';
import { HeygenService } from '@/lib/heygen/heygen-service';
import { db } from '@/lib/db';

// Webhook secret for verification
const WEBHOOK_SECRET = process.env.HEYGEN_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature if applicable
    const signature = req.headers.get('x-heygen-signature') || '';
    
    // Skip signature verification in development
    if (process.env.NODE_ENV === 'production' && WEBHOOK_SECRET) {
      // Implement signature verification here
      // This would typically involve creating a hash of the request body
      // using the webhook secret and comparing it to the signature
    }
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.video_id) {
      return NextResponse.json({ error: 'Missing video_id in webhook payload' }, { status: 400 });
    }
    
    // Process the webhook data
    const heygenService = HeygenService.getInstance();
    await heygenService.handleWebhook(data);
    
    // Update any relevant database records
    if (data.status === 'completed' && data.url) {
      await db.userVideos.updateMany({
        where: { videoId: data.video_id },
        data: {
          status: 'completed',
          url: data.url,
          updatedAt: new Date()
        }
      });
      
      // Trigger any notifications or events
      // This could include sending emails, in-app notifications, etc.
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing HEYGEN webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optionally implement a GET method for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'HEYGEN webhook endpoint active' });
}
