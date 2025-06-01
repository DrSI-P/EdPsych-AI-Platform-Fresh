'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CreditCard, Zap } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

// This hook can be used in any component that needs to check usage limits
export const useFairUsage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [featureQuantity, setFeatureQuantity] = useState(1);
  const [creditInfo, setCreditInfo] = useState(null);
  
  // Mock user ID - in production this would come from authentication
  const userId = 'user1';
  
  // Check if a feature can be used
  const checkFeatureLimit = async (feature) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/subscription/fair-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'checkLimit',
          userId,
          feature,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to check usage limits');
      }
      
      return data;
    } catch (error) {
      console.error('Error checking feature limit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to check usage limits",
        variant: "destructive",
      });
      return { hasReachedLimit: true, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Track usage of a feature
  const trackFeatureUsage = async (feature, quantity = 1) => {
    try {
      const response = await fetch('/api/subscription/fair-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'trackUsage',
          userId,
          feature,
          quantity,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to track usage');
      }
      
      // If usage is approaching limit (80% or more), show a warning
      if (data.limit > 0 && data.usage >= data.limit * 0.8 && data.usage < data.limit) {
        toast({
          title: "Usage Limit Approaching",
          description: `You've used ${data.usage} of ${data.limit} ${feature} this month.`,
          variant: "default",
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to track usage",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };
  
  // Use a feature with credit if limit is reached
  const useFeatureWithCredit = async (feature, quantity = 1) => {
    setIsLoading(true);
    
    try {
      // First check if limit is reached
      const limitCheck = await checkFeatureLimit(feature);
      
      if (!limitCheck.hasReachedLimit) {
        // If limit not reached, just track usage normally
        return await trackFeatureUsage(feature, quantity);
      }
      
      // If limit is reached but credits can be used
      if (limitCheck.canUseCredits) {
        // Check if user has enough credits
        const creditCost = limitCheck.creditCost * quantity;
        
        if (limitCheck.availableCredits >= creditCost) {
          // Use credits for the feature
          const response = await fetch('/api/subscription/fair-usage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'useCreditsForFeature',
              userId,
              feature,
              quantity,
            }),
          });
          
          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.error || 'Failed to use credits');
          }
          
          toast({
            title: "Credits Used",
            description: `${data.used} credits used for ${feature}.`,
            variant: "default",
          });
          
          return { ...data, usedCredits: true };
        } else {
          // Not enough credits, show dialogue to purchase more
          setCurrentFeature(feature);
          setFeatureQuantity(quantity);
          setCreditInfo({
            required: creditCost,
            available: limitCheck.availableCredits,
            shortfall: creditCost - limitCheck.availableCredits,
            feature
          });
          setShowCreditDialog(true);
          return { success: false, needsCredits: true };
        }
      } else {
        // Feature doesn't support credits or other issue
        toast({
          title: "Usage Limit Reached",
          description: `You've reached your monthly limit for ${feature}. Please upgrade your plan.`,
          variant: "destructive",
        });
        return { success: false, limitReached: true };
      }
    } catch (error) {
      console.error('Error using feature with credit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to use feature",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get current credit balance
  const getCredits = async () => {
    try {
      const response = await fetch('/api/subscription/fair-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'manageCredits',
          userId,
          operation: 'check',
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get credits');
      }
      
      return data.credits;
    } catch (error) {
      console.error('Error getting credits:', error);
      return 0;
    }
  };
  
  // Purchase credits (in production this would integrate with payment processing)
  const purchaseCredits = async (amount) => {
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add credits to account
      const response = await fetch('/api/subscription/fair-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'manageCredits',
          userId,
          operation: 'add',
          amount,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to add credits');
      }
      
      toast({
        title: "Credits Purchased",
        description: `${amount} credits have been added to your account.`,
        variant: "success",
      });
      
      setShowCreditDialog(false);
      
      // If we were trying to use a feature, try again
      if (currentFeature) {
        await useFeatureWithCredit(currentFeature, featureQuantity);
        setCurrentFeature(null);
        setFeatureQuantity(1);
      }
      
      return data;
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to purchase credits",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Credit purchase dialogue component
  const CreditPurchaseDialog = () => (
    <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Additional Credits Required</DialogTitle>
          <DialogDescription>
            {creditInfo && `You need ${creditInfo.required} credits to use this feature, but you only have ${creditInfo.available} available.`}
          </DialogDescription>
        </DialogHeader>
        
        <Alert variant="warning" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Credit Shortfall</AlertTitle>
          <AlertDescription>
            {creditInfo && `You need ${creditInfo.shortfall} more credits to proceed.`}
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div 
            className="flex flex-col items-centre justify-between p-4 border rounded-lg cursor-pointer hover:border-primary"
            onClick={() => purchaseCredits(100)}
          >
            <div className="text-centre">
              <h4 className="font-medium">100 Credits</h4>
              <Badge className="mt-1">Basic</Badge>
            </div>
            <div className="mt-2 text-centre">
              <span className="font-bold">£9.99</span>
            </div>
          </div>
          
          <div 
            className="flex flex-col items-centre justify-between p-4 border rounded-lg cursor-pointer hover:border-primary"
            onClick={() => purchaseCredits(500)}
          >
            <div className="text-centre">
              <h4 className="font-medium">500 Credits</h4>
              <Badge variant="secondary" className="mt-1">Save 10%</Badge>
            </div>
            <div className="mt-2 text-centre">
              <span className="font-bold">£44.99</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-centre">
          <Button variant="outline" onClick={() => setShowCreditDialog(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={() => setShowCreditDialog(false)}>
            Upgrade Plan Instead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return {
    isLoading,
    checkFeatureLimit,
    trackFeatureUsage,
    useFeatureWithCredit,
    getCredits,
    purchaseCredits,
    CreditPurchaseDialog,
  };
};

// Example usage component
const FairUsageExample = () => {
  const { 
    isLoading, 
    checkFeatureLimit, 
    trackFeatureUsage, 
    useFeatureWithCredit, 
    getCredits,
    CreditPurchaseDialog 
  } = useFairUsage();
  
  const [credits, setCredits] = useState(0);
  const [usageData, setUsageData] = useState({});
  
  useEffect(() => {
    // Get initial credit balance
    const fetchCredits = async () => {
      const creditBalance = await getCredits();
      setCredits(creditBalance);
    };
    
    // Get initial usage data for demo
    const fetchUsage = async () => {
      const features = ['aiRecommendations', 'progressReports', 'meetingNotes', 'lessonPlans'];
      const usageInfo = {};
      
      for (const feature of features) {
        const data = await checkFeatureLimit(feature);
        usageInfo[feature] = data;
      }
      
      setUsageData(usageInfo);
    };
    
    fetchCredits();
    fetchUsage();
  }, []);
  
  const handleUseFeature = async (feature) => {
    const result = await useFeatureWithCredit(feature);
    
    if (result.success) {
      // Refresh usage data and credits
      const data = await checkFeatureLimit(feature);
      setUsageData(prev => ({ ...prev, [feature]: data }));
      
      const creditBalance = await getCredits();
      setCredits(creditBalance);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Fair Usage Example</h1>
      
      <div className="bg-muted p-6 rounded-lg mb-6">
        <div className="flex justify-between items-centre mb-4">
          <h2 className="text-xl font-semibold">Your AI Credits</h2>
          <div className="flex items-centre">
            <Zap className="h-5 w-5 mr-2 text-amber-500" />
            <span className="text-2xl font-bold">{credits}</span>
          </div>
        </div>
        <p className="mb-4">AI credits allow you to use premium features beyond your subscription limits.</p>
        <Button variant="outline">
          <CreditCard className="h-4 w-4 mr-2" />
          Purchase More Credits
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">AI Content Recommendations</h3>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Usage</p>
            <p className="font-medium">
              {usageData.aiRecommendations ? 
                `${usageData.aiRecommendations.usage} / ${usageData.aiRecommendations.limit}` : 
                'Loading...'}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant={usageData.aiRecommendations?.hasReachedLimit ? "destructive" : "outline"}>
              {usageData.aiRecommendations?.hasReachedLimit ? "Limit Reached" : "Available"}
            </Badge>
          </div>
          <Button 
            onClick={() => handleUseFeature('aiRecommendations')}
            disabled={isLoading}
            className="w-full"
          >
            Generate Recommendation
          </Button>
        </div>
        
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Progress Reports</h3>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Usage</p>
            <p className="font-medium">
              {usageData.progressReports ? 
                `${usageData.progressReports.usage} / ${usageData.progressReports.limit}` : 
                'Loading...'}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant={usageData.progressReports?.hasReachedLimit ? "destructive" : "outline"}>
              {usageData.progressReports?.hasReachedLimit ? "Limit Reached" : "Available"}
            </Badge>
          </div>
          <Button 
            onClick={() => handleUseFeature('progressReports')}
            disabled={isLoading}
            className="w-full"
          >
            Generate Progress Report
          </Button>
        </div>
        
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Meeting Notes</h3>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Usage</p>
            <p className="font-medium">
              {usageData.meetingNotes ? 
                `${usageData.meetingNotes.usage} / ${usageData.meetingNotes.limit}` : 
                'Loading...'}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant={usageData.meetingNotes?.hasReachedLimit ? "destructive" : "outline"}>
              {usageData.meetingNotes?.hasReachedLimit ? "Limit Reached" : "Available"}
            </Badge>
          </div>
          <Button 
            onClick={() => handleUseFeature('meetingNotes')}
            disabled={isLoading}
            className="w-full"
          >
            Transcribe Meeting Notes
          </Button>
        </div>
        
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">AI Lesson Plans</h3>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Usage</p>
            <p className="font-medium">
              {usageData.lessonPlans ? 
                `${usageData.lessonPlans.usage} / ${usageData.lessonPlans.limit}` : 
                'Loading...'}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant={usageData.lessonPlans?.hasReachedLimit ? "destructive" : "outline"}>
              {usageData.lessonPlans?.hasReachedLimit ? "Limit Reached" : "Available"}
            </Badge>
          </div>
          <Button 
            onClick={() => handleUseFeature('lessonPlans')}
            disabled={isLoading}
            className="w-full"
          >
            Generate Lesson Plan
          </Button>
        </div>
      </div>
      
      {/* Credit purchase dialogue */}
      <CreditPurchaseDialog />
    </div>
  );
};

export { useFairUsage, FairUsageExample };
