/**
 * Stripe Integration Service for EdPsych AI Education Platform
 * 
 * This module provides a comprehensive integration with Stripe for subscription
 * management, payment processing, and webhook handling.
 */

import Stripe from 'stripe';
import { getEnv } from '@/lib/env-validator';
import { db } from '@/lib/db';

// Initialize Stripe client with validated environment variables
const env = getEnv();
const stripe = new Stripe(
  process.env.NODE_ENV === 'production' 
    ? env.stripe.secretKey 
    : env.stripe.testSecretKey,
  {
    apiVersion: '2023-10-16', // Use the latest stable API version
    appInfo: {
      name: 'EdPsych AI Education Platform',
      version: '1.0.0',
    },
  }
);

// Subscription plan IDs - these would be created in the Stripe dashboard
export const SUBSCRIPTION_PLANS = {
  STANDARD: {
    MONTHLY: process.env.STRIPE_STANDARD_MONTHLY_PLAN_ID || 'price_standard_monthly',
    YEARLY: process.env.STRIPE_STANDARD_YEARLY_PLAN_ID || 'price_standard_yearly',
  },
  PREMIUM: {
    MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PLAN_ID || 'price_premium_monthly',
    YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PLAN_ID || 'price_premium_yearly',
  },
  FAMILY: {
    MONTHLY: process.env.STRIPE_FAMILY_MONTHLY_PLAN_ID || 'price_family_monthly',
    YEARLY: process.env.STRIPE_FAMILY_YEARLY_PLAN_ID || 'price_family_yearly',
  },
};

// Credit package IDs
export const CREDIT_PACKAGES = {
  SMALL: process.env.STRIPE_SMALL_CREDIT_PACKAGE_ID || 'price_small_credits',
  MEDIUM: process.env.STRIPE_MEDIUM_CREDIT_PACKAGE_ID || 'price_medium_credits',
  LARGE: process.env.STRIPE_LARGE_CREDIT_PACKAGE_ID || 'price_large_credits',
};

// Subscription tier to credits mapping
export const TIER_MONTHLY_CREDITS: Record<string, number> = {
  'free': 0,
  'standard': 20,
  'premium': 50,
  'family': 100,
  'classroom': 300,
  'school': 1000,
  'district': 5000,
};

// Interface for subscription checkout parameters
export interface SubscriptionCheckoutParams {
  customerId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}

// Interface for credit purchase checkout parameters
export interface CreditPurchaseCheckoutParams {
  customerId: string;
  priceId: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe customer for a new user
 */
export async function createCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<string> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });
    
    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create customer account. Please try again later.');
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createSubscriptionCheckout({
  customerId,
  planId,
  successUrl,
  cancelUrl,
  trialDays = 0,
  metadata = {},
}: SubscriptionCheckoutParams): Promise<string> {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: trialDays > 0 ? {
        trial_period_days: trialDays,
      } : undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });
    
    return session.url || '';
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    throw new Error('Failed to create subscription checkout. Please try again later.');
  }
}

/**
 * Create a checkout session for credit purchase
 */
export async function createCreditPurchaseCheckout({
  customerId,
  priceId,
  quantity = 1,
  successUrl,
  cancelUrl,
  metadata = {},
}: CreditPurchaseCheckoutParams): Promise<string> {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });
    
    return session.url || '';
  } catch (error) {
    console.error('Error creating credit purchase checkout:', error);
    throw new Error('Failed to create credit purchase checkout. Please try again later.');
  }
}

/**
 * Get a customer's active subscriptions
 */
export async function getActiveSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.default_payment_method'],
    });
    
    return subscriptions.data;
  } catch (error) {
    console.error('Error fetching active subscriptions:', error);
    throw new Error('Failed to fetch subscription information. Please try again later.');
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<void> {
  try {
    if (cancelAtPeriodEnd) {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      await stripe.subscriptions.cancel(subscriptionId);
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new Error('Failed to cancel subscription. Please try again later.');
  }
}

/**
 * Update a subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<void> {
  try {
    // Get the subscription to find the current items
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Update the subscription with the new price
    await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription. Please try again later.');
  }
}

/**
 * Get customer payment methods
 */
export async function getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    
    return paymentMethods.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw new Error('Failed to fetch payment methods. Please try again later.');
  }
}

/**
 * Create a portal session for subscription management
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    return session.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new Error('Failed to create customer portal session. Please try again later.');
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhookEvent(
  payload: Buffer,
  signature: string
): Promise<{ received: boolean; event?: Stripe.Event }> {
  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.stripe.webhookSecret
    );
    
    // Process the event based on its type
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle subscription checkout completion
        if (session.mode === 'subscription') {
          await handleSubscriptionCreated(session);
        }
        
        // Handle one-time payment (credit purchase) completion
        if (session.mode === 'payment') {
          await handleCreditPurchase(session);
        }
        
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
    }
    
    return { received: true, event };
  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw new Error('Failed to process webhook event.');
  }
}

/**
 * Handle subscription creation from checkout session
 */
async function handleSubscriptionCreated(session: Stripe.Checkout.Session): Promise<void> {
  if (!session.customer || !session.subscription) {
    console.error('Missing customer or subscription ID in session:', session.id);
    return;
  }
  
  const customerId = typeof session.customer === 'string' 
    ? session.customer 
    : session.customer.id;
  
  const subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription.id;
  
  try {
    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Determine the subscription tier from the price ID
    const priceId = subscription.items.data[0].price.id;
    let tier = 'standard'; // Default tier
    
    if (priceId === SUBSCRIPTION_PLANS.PREMIUM.MONTHLY || priceId === SUBSCRIPTION_PLANS.PREMIUM.YEARLY) {
      tier = 'premium';
    } else if (priceId === SUBSCRIPTION_PLANS.FAMILY.MONTHLY || priceId === SUBSCRIPTION_PLANS.FAMILY.YEARLY) {
      tier = 'family';
    }
    
    // Find the user by Stripe customer ID
    const user = await db.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    
    if (!user) {
      console.error('User not found for Stripe customer ID:', customerId);
      return;
    }
    
    // Update the user's subscription information
    await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: 'active',
        subscriptionId: subscriptionId,
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
    
    // Add the monthly credits for the tier
    const monthlyCredits = TIER_MONTHLY_CREDITS[tier] || 0;
    
    // Check if user already has credits
    const existingCredits = await db.userCredits.findUnique({
      where: { userId: user.id },
    });
    
    if (existingCredits) {
      // Update existing credits
      await db.userCredits.update({
        where: { userId: user.id },
        data: {
          remainingCredits: {
            increment: monthlyCredits,
          },
          lastCreditRefresh: new Date(),
        },
      });
    } else {
      // Create new credits record
      await db.userCredits.create({
        data: {
          userId: user.id,
          remainingCredits: monthlyCredits,
          usedCredits: 0,
          lastCreditRefresh: new Date(),
        },
      });
    }
    
    // Log the subscription event
    await db.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: 'subscription_created',
        tier,
        stripeSubscriptionId: subscriptionId,
        metadata: {
          priceId,
          customerId,
        },
      },
    });
  } catch (error) {
    console.error('Error processing subscription creation:', error);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  
  try {
    // Find the user by Stripe customer ID
    const user = await db.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    
    if (!user) {
      console.error('User not found for Stripe customer ID:', customerId);
      return;
    }
    
    // Determine the subscription tier from the price ID
    const priceId = subscription.items.data[0].price.id;
    let tier = 'standard'; // Default tier
    
    if (priceId === SUBSCRIPTION_PLANS.PREMIUM.MONTHLY || priceId === SUBSCRIPTION_PLANS.PREMIUM.YEARLY) {
      tier = 'premium';
    } else if (priceId === SUBSCRIPTION_PLANS.FAMILY.MONTHLY || priceId === SUBSCRIPTION_PLANS.FAMILY.YEARLY) {
      tier = 'family';
    }
    
    // Update the user's subscription information
    await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: subscription.status,
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
    
    // Log the subscription event
    await db.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: 'subscription_updated',
        tier,
        stripeSubscriptionId: subscriptionId,
        metadata: {
          priceId,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      },
    });
  } catch (error) {
    console.error('Error processing subscription update:', error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  
  try {
    // Find the user by Stripe customer ID
    const user = await db.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    
    if (!user) {
      console.error('User not found for Stripe customer ID:', customerId);
      return;
    }
    
    // Update the user's subscription information
    await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled',
        cancelAtPeriodEnd: false,
      },
    });
    
    // Log the subscription event
    await db.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: 'subscription_cancelled',
        tier: user.subscriptionTier,
        stripeSubscriptionId: subscriptionId,
      },
    });
  } catch (error) {
    console.error('Error processing subscription cancellation:', error);
  }
}

/**
 * Handle successful invoice payment (for subscription renewals)
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.customer || !invoice.subscription) {
    return;
  }
  
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer.id;
  
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id;
  
  try {
    // Find the user by Stripe customer ID
    const user = await db.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    
    if (!user) {
      console.error('User not found for Stripe customer ID:', customerId);
      return;
    }
    
    // Get the subscription to update the period end
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Update the user's subscription information
    await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'active',
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
    
    // Add the monthly credits for the tier
    const tier = user.subscriptionTier;
    const monthlyCredits = TIER_MONTHLY_CREDITS[tier] || 0;
    
    // Update user credits
    await db.userCredits.update({
      where: { userId: user.id },
      data: {
        remainingCredits: {
          increment: monthlyCredits,
        },
        lastCreditRefresh: new Date(),
      },
    });
    
    // Log the invoice payment event
    await db.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: 'invoice_paid',
        tier,
        stripeSubscriptionId: subscriptionId,
        metadata: {
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
        },
      },
    });
  } catch (error) {
    console.error('Error processing invoice payment:', error);
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.customer || !invoice.subscription) {
    return;
  }
  
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer.id;
  
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id;
  
  try {
    // Find the user by Stripe customer ID
    const user = await db.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    
    if (!user) {
      console.error('User not found for Stripe customer ID:', customerId);
      return;
    }
    
    // Update the user's subscription information
    await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'past_due',
      },
    });
    
    // Log the invoice payment failed event
    await db.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: 'invoice_payment_failed',
        tier: user.subscriptionTier,
        stripeSubscriptionId: subscriptionId,
        metadata: {
          invoiceId: invoice.id,
          amount: invoice.amount_due,
          currency: invoice.currency,
          attemptCount: invoice.attempt_count,
        },
      },
    });
    
    // TODO: Send payment failure notification to user
  } catch (error) {
    console.error('Error processing invoice payment failure:', error);
  }
}

/**
 * Handle credit purchase
 */
async function handleCreditPurchase(session: Stripe.Checkout.Session): Promise<void> {
  if (!session.customer || !session.metadata?.creditAmount) {
    console.error('Missing customer or credit amount in session:', session.id);
    return;
  }
  
  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer.id;
  
  const creditAmount = parseInt(session.metadata.creditAmount, 10);
  
  if (isNaN(creditAmount)) {
    console.error('Invalid credit amount in session metadata:', session.metadata.creditAmount);
    return;
  }
  
  try {
    // Find the user by Stripe customer ID
    const user = await db.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    
    if (!user) {
      console.error('User not found for Stripe customer ID:', customerId);
      return;
    }
    
    // Check if user already has credits
    const existingCredits = await db.userCredits.findUnique({
      where: { userId: user.id },
    });
    
    if (existingCredits) {
      // Update existing credits
      await db.userCredits.update({
        where: { userId: user.id },
        data: {
          remainingCredits: {
            increment: creditAmount,
          },
        },
      });
    } else {
      // Create new credits record
      await db.userCredits.create({
        data: {
          userId: user.id,
          remainingCredits: creditAmount,
          usedCredits: 0,
          lastCreditRefresh: new Date(),
        },
      });
    }
    
    // Log the credit purchase event
    await db.creditPurchase.create({
      data: {
        userId: user.id,
        amount: creditAmount,
        stripeSessionId: session.id,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    console.error('Error processing credit purchase:', error);
  }
}
