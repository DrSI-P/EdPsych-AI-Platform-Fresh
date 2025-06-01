'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle2, 
  CreditCard, 
  Download, 
  FileText, 
  Settings 
} from 'lucide-react';
import { 
  useTenantSubscription, 
  SubscriptionDetails, 
  BillingInterval 
} from '@/lib/multi-tenant/subscription-management';
import { useTenant } from '@/lib/multi-tenant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';

/**
 * Subscription management dashboard component
 * Allows tenant administrators to manage their subscription
 */
export default function SubscriptionManagementPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const tenantId = params.id;
  const { currentTenant } = useTenant();
  const { 
    subscription, 
    isLoading, 
    error, 
    createBillingPortal, 
    updateQuantity, 
    cancelSubscription, 
    reactivateSubscription 
  } = useTenantSubscription(tenantId);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  
  // Reset messages when tab changes
  useEffect(() => {
    setActionError(null);
    setActionSuccess(null);
  }, [activeTab]);
  
  // Handle billing portal access
  const handleBillingPortal = async () => {
    setIsProcessing(true);
    setActionError(null);
    
    try {
      const result = await createBillingPortal();
      if (result?.portalUrl) {
        window.location.href = result.portalUrl;
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      setActionError('Failed to access billing portal. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle subscription cancellation
  const handleCancelSubscription = async (atPeriodEnd: boolean = true) => {
    setIsProcessing(true);
    setActionError(null);
    
    try {
      await cancelSubscription(atPeriodEnd);
      setActionSuccess(
        atPeriodEnd 
          ? 'Your subscription has been cancelled and will end at the current billing period.' 
          : 'Your subscription has been cancelled immediately.'
      );
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setActionError('Failed to cancel subscription. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle subscription reactivation
  const handleReactivateSubscription = async () => {
    setIsProcessing(true);
    setActionError(null);
    
    try {
      await reactivateSubscription();
      setActionSuccess('Your subscription has been successfully reactivated.');
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      setActionError('Failed to reactivate subscription. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle quantity update
  const handleUpdateQuantity = async (newQuantity: number) => {
    setIsProcessing(true);
    setActionError(null);
    
    try {
      await updateQuantity(newQuantity);
      setActionSuccess('Subscription quantity updated successfully.');
    } catch (error) {
      console.error('Error updating quantity:', error);
      setActionError('Failed to update quantity. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };
  
  // Get billing interval display text
  const getBillingIntervalText = (interval: BillingInterval) => {
    switch (interval) {
      case BillingInterval.MONTHLY:
        return 'Monthly';
      case BillingInterval.QUARTERLY:
        return 'Quarterly';
      case BillingInterval.ANNUAL:
        return 'Annual';
      default:
        return 'Unknown';
    }
  };
  
  // Get subscription status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-500">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'incomplete':
        return <Badge className="bg-orange-500">Incomplete</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
          <p>Loading subscription details...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load subscription details. Please try again later.
            </AlertDescription>
          </Alert>
          <Button 
            className="mt-4" 
            onClick={() => router.refresh()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  // Render no subscription state
  if (!subscription) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Active Subscription</CardTitle>
              <CardDescription>
                You don't have an active subscription for this tenant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Choose a subscription plan to access premium features and enhance your experience.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => router.push(`/admin/tenants/${tenantId}/subscription/pricing`)}
              >
                View Plans
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription, billing, and plan details
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          {getStatusBadge(subscription.status)}
          <Button 
            variant="outline" 
            onClick={handleBillingPortal}
            disabled={isProcessing}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Billing Portal
          </Button>
        </div>
      </div>
      
      {/* Action messages */}
      {actionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}
      
      {actionSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-700">{actionSuccess}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Your current subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Plan</div>
                    <div className="font-medium">{subscription.tier}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-medium">{getStatusBadge(subscription.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Billing Interval</div>
                    <div className="font-medium">{getBillingIntervalText(subscription.billingInterval)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="font-medium">{subscription.quantity}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/admin/tenants/${tenantId}/subscription/pricing`)}
                >
                  Change Plan
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing Period</CardTitle>
                <CardDescription>Your current billing cycle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Current Period Start</div>
                    <div className="font-medium">{formatDate(subscription.currentPeriodStart)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Period End</div>
                    <div className="font-medium">{formatDate(subscription.currentPeriodEnd)}</div>
                  </div>
                  {subscription.trialEnd && (
                    <div>
                      <div className="text-sm text-muted-foreground">Trial End</div>
                      <div className="font-medium">{formatDate(subscription.trialEnd)}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground">Auto Renew</div>
                    <div className="font-medium">
                      {subscription.cancelAtPeriodEnd ? 'No' : 'Yes'}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={subscription.cancelAtPeriodEnd ? "default" : "outline"} 
                  className="w-full"
                  onClick={subscription.cancelAtPeriodEnd 
                    ? () => handleReactivateSubscription() 
                    : () => handleCancelSubscription(true)
                  }
                  disabled={isProcessing}
                >
                  {subscription.cancelAtPeriodEnd ? "Reactivate Subscription" : "Cancel Renewal"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleBillingPortal}
                    disabled={isProcessing}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Payment Methods
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(`/admin/tenants/${tenantId}/subscription/invoices`)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Invoices
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(`/admin/tenants/${tenantId}/subscription/usage`)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Usage Report
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleCancelSubscription(false)}
                  disabled={isProcessing || subscription.status === 'canceled'}
                >
                  Cancel Immediately
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
