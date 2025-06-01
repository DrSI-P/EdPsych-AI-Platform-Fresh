import { NextRequest, NextResponse } from 'next/server';
import { handleWebhookEvent } from '@/lib/stripe/stripe-service';
import { getEnv } from '@/lib/env-validator';

/**
 * Stripe Webhook Handler for EdPsych AI Education Platform
 * 
 * This API route handles incoming webhook events from Stripe for subscription
 * management, payment processing, and credit purchases.
 */
export async function POST(req: NextRequest) {
  try {
    // Get the request body as raw buffer
    const payload = await req.text();
    
    // Get the Stripe signature from the headers
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }
    
    // Process the webhook event
    const { received, event } = await handleWebhookEvent(
      Buffer.from(payload),
      signature
    );
    
    if (received) {
      return NextResponse.json({ received: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to process webhook event' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
