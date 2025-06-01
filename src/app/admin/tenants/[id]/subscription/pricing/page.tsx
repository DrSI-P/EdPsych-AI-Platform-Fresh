'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { 
  BillingInterval, 
  SubscriptionPlan, 
  useSubscriptionPlans, 
  useTenantSubscription 
} from '@/lib/multi-tenant/subscription-management';
import { useTenant } from '@/lib/multi-tenant';

/**
 * Subscription pricing page component
 * Displays available subscription plans with pricing options
 */
export default function SubscriptionPricingPage() {
  const router = useRouter();
  const { plans, isLoading: plansLoading } = useSubscriptionPlans();
  const { currentTenant } = useTenant();
  const { subscription, createCheckout } = useTenantSubscription(currentTenant?.id || '');
  
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(BillingInterval.ANNUAL);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Handle subscription checkout
  const handleCheckout = async (plan: SubscriptionPlan) => {
    if (!currentTenant) {
      // Redirect to tenant selection or creation if no tenant is selected
      router.push('/admin/tenants');
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      // Create checkout session
      const result = await createCheckout({
        planId: plan.id,
        billingInterval,
        quantity: 1, // Default to 1, can be adjusted later
        successUrl: `${window.location.origin}/admin/tenants/${currentTenant.id}/subscription/success`,
        cancelUrl: `${window.location.origin}/admin/tenants/${currentTenant.id}/subscription/pricing`,
      });
      
      // Redirect to checkout URL
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Show error message
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  // Format price for display
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };
  
  // Check if a plan is the current subscription
  const isCurrentPlan = (plan: SubscriptionPlan) => {
    return subscription?.planId === plan.id;
  };
  
  // Render loading state
  if (plansLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>
          <p>Loading subscription plans...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground mb-6">
          Choose the perfect plan for your organization
        </p>
        
        {/* Billing interval selector */}
        <div className="flex justify-center mb-10">
          <Tabs
            defaultValue={billingInterval}
            onValueChange={(value) => setBillingInterval(value as BillingInterval)}
            className="w-full max-w-md"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value={BillingInterval.MONTHLY}>Monthly</TabsTrigger>
              <TabsTrigger value={BillingInterval.QUARTERLY}>Quarterly</TabsTrigger>
              <TabsTrigger value={BillingInterval.ANNUAL}>
                Annual
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                  Save 15%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Subscription plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan) => {
            const price = plan.pricing[billingInterval];
            const isEnterprise = plan.tier === 'enterprise';
            const isPlanPopular = plan.isPopular;
            
            return (
              <Card 
                key={plan.id} 
                className={`flex flex-col ${isPlanPopular ? 'border-primary shadow-lg' : ''}`}
              >
                {isPlanPopular && (
                  <div className="bg-primary text-primary-foreground text-sm py-1 px-3 rounded-t-md">
                    Most Popular
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="mb-4">
                    {isEnterprise ? (
                      <div className="text-3xl font-bold">Custom</div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold">
                          {formatPrice(price.amount, price.currency)}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {billingInterval === BillingInterval.MONTHLY && 'per month'}
                          {billingInterval === BillingInterval.QUARTERLY && 'per quarter'}
                          {billingInterval === BillingInterval.ANNUAL && 'per year'}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  {isCurrentPlan(plan) ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : isEnterprise ? (
                    <Button 
                      className="w-full" 
                      onClick={() => router.push('/contact?subject=Enterprise%20Plan')}
                    >
                      Contact Sales
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleCheckout(plan)}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? 'Processing...' : 'Subscribe'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-10 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Need a custom solution?</h2>
          <p className="text-muted-foreground mb-4">
            Contact our sales team to discuss your specific requirements and get a tailored quote.
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/contact?subject=Custom%20Subscription')}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}
