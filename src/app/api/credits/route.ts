import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { db } from '@/lib/db';

/**
 * API Route for Credit Purchases
 * 
 * This API route handles the purchase of additional AI video generation credits
 * for the EdPsych AI Education Platform.
 */
export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_TEST_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      );
    }

    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    const { package: creditPackage, quantity = 1, successUrl, cancelUrl } = body;
    
    if (!creditPackage || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the user from the database
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // For now, return a placeholder response since Stripe may not be fully configured
    return NextResponse.json({ 
      url: successUrl,
      message: 'Credit purchase feature will be available soon'
    });
  } catch (error) {
    console.error('Error creating credit purchase:', error);
    
    return NextResponse.json(
      { error: 'Failed to create credit purchase' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the user from the database
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get the user's credits
    const credits = await db.userCredits.findUnique({
      where: { userId: user.id },
    });
    
    // Get the user's credit purchase history
    const purchases = await db.creditPurchase.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    return NextResponse.json({
      remainingCredits: credits?.remainingCredits || 0,
      usedCredits: credits?.usedCredits || 0,
      lastRefresh: credits?.lastCreditRefresh,
      purchases,
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}

