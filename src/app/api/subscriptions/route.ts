import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BillingInterval, SubscriptionPlan, SubscriptionTier } from '@/lib/multi-tenant/subscription-management';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Validation schemas
const createCheckoutSessionSchema = z.object({
  planId: z.string(),
  billingInterval: z.nativeEnum(BillingInterval),
  quantity: z.number().int().positive(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

/**
 * GET /api/subscriptions/plans
 * Get all available subscription plans
 */
export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would query a database or Stripe
    // For now, we'll return mock data
    const plans: SubscriptionPlan[] = [
      {
        id: 'plan_free',
        name: 'Free',
        description: 'Basic features for small organizations or trial users',
        tier: SubscriptionTier.FREE,
        features: [
          'Up to 5 users',
          'Basic learning paths',
          'Standard curriculum content',
          'Email support'
        ],
        pricing: {
          [BillingInterval.MONTHLY]: {
            amount: 0,
            currency: 'GBP',
            stripePriceId: 'price_free_monthly'
          },
          [BillingInterval.QUARTERLY]: {
            amount: 0,
            currency: 'GBP',
            stripePriceId: 'price_free_quarterly'
          },
          [BillingInterval.ANNUAL]: {
            amount: 0,
            currency: 'GBP',
            stripePriceId: 'price_free_annual'
          }
        },
        maxUsers: 5
      },
      {
        id: 'plan_basic',
        name: 'Basic',
        description: 'Essential features for small to medium schools',
        tier: SubscriptionTier.BASIC,
        features: [
          'Up to 50 users',
          'Personalized learning paths',
          'Standard curriculum content',
          'Basic analytics',
          'Parent portal',
          'Email and chat support'
        ],
        pricing: {
          [BillingInterval.MONTHLY]: {
            amount: 199,
            currency: 'GBP',
            stripePriceId: 'price_basic_monthly'
          },
          [BillingInterval.QUARTERLY]: {
            amount: 537,
            currency: 'GBP',
            stripePriceId: 'price_basic_quarterly'
          },
          [BillingInterval.ANNUAL]: {
            amount: 1990,
            currency: 'GBP',
            stripePriceId: 'price_basic_annual'
          }
        },
        maxUsers: 50
      },
      {
        id: 'plan_standard',
        name: 'Standard',
        description: 'Comprehensive features for medium to large schools',
        tier: SubscriptionTier.STANDARD,
        features: [
          'Up to 200 users',
          'Advanced personalized learning paths',
          'Full curriculum content library',
          'Advanced analytics',
          'Parent portal with communication tools',
          'Collaborative learning features',
          'AI tutoring system',
          'Priority support'
        ],
        pricing: {
          [BillingInterval.MONTHLY]: {
            amount: 499,
            currency: 'GBP',
            stripePriceId: 'price_standard_monthly'
          },
          [BillingInterval.QUARTERLY]: {
            amount: 1347,
            currency: 'GBP',
            stripePriceId: 'price_standard_quarterly'
          },
          [BillingInterval.ANNUAL]: {
            amount: 4990,
            currency: 'GBP',
            stripePriceId: 'price_standard_annual'
          }
        },
        isPopular: true,
        maxUsers: 200
      },
      {
        id: 'plan_premium',
        name: 'Premium',
        description: 'Advanced features for large schools and districts',
        tier: SubscriptionTier.PREMIUM,
        features: [
          'Up to 500 users',
          'Advanced personalized learning paths',
          'Full curriculum content library with customization',
          'Predictive analytics and insights',
          'Enhanced parent portal with advanced communication',
          'Advanced collaborative learning features',
          'Enhanced AI tutoring system',
          'Dedicated account manager',
          'API access'
        ],
        pricing: {
          [BillingInterval.MONTHLY]: {
            amount: 999,
            currency: 'GBP',
            stripePriceId: 'price_premium_monthly'
          },
          [BillingInterval.QUARTERLY]: {
            amount: 2697,
            currency: 'GBP',
            stripePriceId: 'price_premium_quarterly'
          },
          [BillingInterval.ANNUAL]: {
            amount: 9990,
            currency: 'GBP',
            stripePriceId: 'price_premium_annual'
          }
        },
        maxUsers: 500
      },
      {
        id: 'plan_enterprise',
        name: 'Enterprise',
        description: 'Custom solutions for large districts and organizations',
        tier: SubscriptionTier.ENTERPRISE,
        features: [
          'Unlimited users',
          'Custom learning paths and curriculum',
          'White-labeling options',
          'Advanced data integration',
          'Custom analytics and reporting',
          'Enterprise-grade security',
          'SLA guarantees',
          'Dedicated success team',
          'Full API access',
          'Custom feature development'
        ],
        pricing: {
          [BillingInterval.MONTHLY]: {
            amount: 0, // Custom pricing
            currency: 'GBP',
            stripePriceId: 'price_enterprise_monthly'
          },
          [BillingInterval.QUARTERLY]: {
            amount: 0, // Custom pricing
            currency: 'GBP',
            stripePriceId: 'price_enterprise_quarterly'
          },
          [BillingInterval.ANNUAL]: {
            amount: 0, // Custom pricing
            currency: 'GBP',
            stripePriceId: 'price_enterprise_annual'
          }
        }
      }
    ];

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return NextResponse.json(
      { message: 'Failed to get subscription plans' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions/checkout
 * Create a checkout session for a tenant
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    const validatedData = createCheckoutSessionSchema.parse(body);
    
    // Get the plan
    // In a real implementation, this would query a database or Stripe
    // For now, we'll use the mock data from above
    const plans = await GET(request).then(res => res.json());
    const plan = plans.find((p: SubscriptionPlan) => p.id === validatedData.planId);
    
    if (!plan) {
      return NextResponse.json(
        { message: 'Plan not found' },
        { status: 404 }
      );
    }
    
    // Get the price for the selected billing interval
    const price = plan.pricing[validatedData.billingInterval];
    
    // In a real implementation, this would create a checkout session in Stripe
    // For now, we'll simulate the response
    
    // Simulate Stripe checkout session creation
    // In a real implementation, this would be:
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.stripePriceId,
          quantity: validatedData.quantity,
        },
      ],
      mode: 'subscription',
      success_url: validatedData.successUrl,
      cancel_url: validatedData.cancelUrl,
      client_reference_id: tenantId,
      subscription_data: {
        metadata: {
          tenantId,
          planId: validatedData.planId,
          billingInterval: validatedData.billingInterval,
        },
      },
    });
    */
    
    // Mock checkout session
    const mockSession = {
      id: `cs_${Date.now()}`,
      url: `https://checkout.stripe.com/pay/cs_test_${Date.now()}`,
    };
    
    // Return response
    return NextResponse.json({
      checkoutUrl: mockSession.url,
      sessionId: mockSession.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
