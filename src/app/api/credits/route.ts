import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { 
  createCustomer, 
  createCreditPurchaseCheckout, 
  CREDIT_PACKAGES 
} from '@/lib/stripe/stripe-service';
import { db } from '@/lib/db';

/**
 * API Route for Credit Purchases
 * 
 * This API route handles the purchase of additional AI video generation credits
 * for the EdPsych AI Education Platform.
 */
export async function POST(req: NextRequest) {
  try {
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
    
    // Ensure the user has a Stripe customer ID
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      // Create a new Stripe customer
      customerId = await createCustomer(
        user.email,
        user.name || undefined,
        { userId: user.id }
      );
      
      // Update the user with the new Stripe customer ID
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }
    
    // Determine the price ID based on the selected package
    let priceId: string;
    
    switch (creditPackage) {
      case 'small':
        priceId = CREDIT_PACKAGES.SMALL;
        break;
      case 'medium':
        priceId = CREDIT_PACKAGES.MEDIUM;
        break;
      case 'large':
        priceId = CREDIT_PACKAGES.LARGE;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid credit package selected' },
          { status: 400 }
        );
    }
    
    // Create a checkout session
    const checkoutUrl = await createCreditPurchaseCheckout({
      customerId,
      priceId,
      quantity,
      successUrl,
      cancelUrl,
      metadata: {
        userId: user.id,
        creditPackage,
        quantity: quantity.toString(),
      },
    });
    
    return NextResponse.json({ url: checkoutUrl });
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
