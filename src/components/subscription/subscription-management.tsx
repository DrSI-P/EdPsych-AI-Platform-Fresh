'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle, CreditCard, Package, Zap, Shield, Users, BarChart, Clock, Gift } from 'lucide-react';

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [aiCredits, setAiCredits] = useState(0);
  const [usageData, setUsageData] = useState({
    aiRecommendations: { used: 0, total: 0 },
    progressReports: { used: 0, total: 0 },
    meetingNotes: { used: 0, total: 0 },
    lessonPlans: { used: 0, total: 0 },
    storage: { used: 0, total: 0 }
  });
  const [invoices, setInvoices] = useState([]);
  const [addOns, setAddOns] = useState([]);
  
  // Simulated data - would be fetched from API in production
  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Explorer',
      price: { monthly: 0, annual: 0 },
      description: 'Basic access for individual educators',
      features: [
        'Up to 5 student profiles',
        'Basic assessment tools',
        'Limited resource library access',
        'Community forum access',
        'Basic analytics',
        'Ad-supported experience'
      ],
      limitations: [
        'No AI-powered features',
        'Limited storage (100MB)',
        'No integration capabilities',
        'Basic support only',
        'EdPsych branding on all materials'
      ],
      badge: null,
      aiLimits: {
        recommendations: 0,
        progressReports: 0,
        meetingNotes: 0,
        lessonPlans: 0
      },
      storage: 100
    },
    {
      id: 'educator',
      name: 'Educator',
      price: { monthly: 8.99, annual: 89.99 },
      description: 'For individual teachers and tutors',
      features: [
        'Up to 30 student profiles',
        'Full assessment toolkit',
        'Complete resource library access',
        'Basic AI-assisted content recommendations',
        'Basic student progress tracking',
        'Email support',
        'Ad-free experience',
        '1GB storage'
      ],
      limitations: [],
      badge: null,
      aiLimits: {
        recommendations: 50,
        progressReports: 10,
        meetingNotes: 5,
        lessonPlans: 0
      },
      storage: 1000
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 14.99, annual: 149.99 },
      description: 'For educational psychologists and specialist educators',
      features: [
        'Up to 100 student profiles',
        'Advanced assessment tools',
        'AI-powered lesson planning',
        'Enhanced progress tracking and analytics',
        'Parent communication tools',
        'Priority email support',
        '5GB storage',
        'Basic API access',
        'Custom branding options'
      ],
      limitations: [],
      badge: 'Popular',
      aiLimits: {
        recommendations: 200,
        progressReports: 50,
        meetingNotes: 20,
        lessonPlans: 10
      },
      storage: 5000
    },
    {
      id: 'institution',
      name: 'Institution',
      price: { monthly: 11.99, annual: 119.99 },
      description: 'For schools and educational institutions (min. 10 educators)',
      features: [
        'Unlimited student profiles',
        'Advanced analytics and reporting',
        'Administrative dashboard',
        'Team collaboration tools',
        'Role-based access controls',
        'Phone and email support',
        '20GB shared storage',
        'Full API access',
        'White-labelling options',
        'Dedicated account manager'
      ],
      limitations: [],
      badge: 'Best Value',
      aiLimits: {
        recommendations: 300,
        progressReports: 100,
        meetingNotes: 50,
        lessonPlans: 30
      },
      storage: 20000
    }
  ];
  
  const creditPackages = [
    { id: 'small', name: '100 AI Credits', price: 9.99, credits: 100, savings: '0%' },
    { id: 'medium', name: '500 AI Credits', price: 44.99, credits: 500, savings: '10%' },
    { id: 'large', name: '1000 AI Credits', price: 79.99, credits: 1000, savings: '20%' },
    { id: 'xlarge', name: '5000 AI Credits', price: 349.99, credits: 5000, savings: '30%' }
  ];
  
  const featureAddOns = [
    { id: 'storage', name: 'Additional Storage (10GB)', price: { monthly: 4.99, annual: 49.99 } },
    { id: 'analytics', name: 'Advanced Analytics Package', price: { monthly: 9.99, annual: 99.99 } },
    { id: 'parent', name: 'Parent Portal Access', price: { monthly: 3.99, annual: 39.99 }, per: 'class' },
    { id: 'pd', name: 'Professional Development Bundle', price: { monthly: 7.99, annual: 79.99 } },
    { id: 'blockchain', name: 'Blockchain Credentials Package', price: { monthly: 12.99, annual: 129.99 } }
  ];
  
  // Simulated API calls - would be real API calls in production
  useEffect(() => {
    // Simulate fetching current subscription
    setTimeout(() => {
      setCurrentSubscription({
        plan: 'educator',
        startDate: '2025-04-01',
        nextBillingDate: '2025-05-01',
        billingCycle: 'monthly',
        status: 'active'
      });
      
      setAiCredits(75);
      
      setUsageData({
        aiRecommendations: { used: 32, total: 50 },
        progressReports: { used: 7, total: 10 },
        meetingNotes: { used: 3, total: 5 },
        lessonPlans: { used: 0, total: 0 },
        storage: { used: 450, total: 1000 }
      });
      
      setInvoices([
        { id: 'INV-2025-0412', date: '2025-04-01', amount: 8.99, status: 'paid' },
        { id: 'INV-2025-0312', date: '2025-03-01', amount: 8.99, status: 'paid' },
        { id: 'INV-2025-0212', date: '2025-02-01', amount: 8.99, status: 'paid' }
      ]);
      
      setAddOns([
        { id: 'analytics', name: 'Advanced Analytics Package', price: 9.99, billingCycle: 'monthly', nextBillingDate: '2025-05-01' }
      ]);
    }, 1000);
  }, []);
  
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setPaymentDialogOpen(true);
  };
  
  const handlePaymentSubmit = () => {
    // Simulate payment processing
    toast({
      title: "Subscription Updated",
      description: "Your subscription has been successfully updated.",
      variant: "success",
    });
    
    // Update current subscription
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    setCurrentSubscription({
      plan: selectedPlan,
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: '2025-06-01',
      billingCycle: billingCycle,
      status: 'active'
    });
    
    // Update usage limits based on new plan
    setUsageData({
      aiRecommendations: { used: 0, total: plan.aiLimits.recommendations },
      progressReports: { used: 0, total: plan.aiLimits.progressReports },
      meetingNotes: { used: 0, total: plan.aiLimits.meetingNotes },
      lessonPlans: { used: 0, total: plan.aiLimits.lessonPlans },
      storage: { used: 0, total: plan.storage }
    });
    
    setPaymentDialogOpen(false);
  };
  
  const handleBuyCreditPackage = (packageId) => {
    const creditPackage = creditPackages.find(p => p.id === packageId);
    
    // Simulate payment processing
    toast({
      title: "Credits Purchased",
      description: `You have successfully purchased ${creditPackage.credits} AI credits.`,
      variant: "success",
    });
    
    // Update AI credits
    setAiCredits(aiCredits + creditPackage.credits);
  };
  
  const handleAddOnToggle = (addOnId) => {
    const existingAddOn = addOns.find(a => a.id === addOnId);
    
    if (existingAddOn) {
      // Remove add-on
      setAddOns(addOns.filter(a => a.id !== addOnId));
      
      toast({
        title: "Add-On Removed",
        description: "The add-on will be removed at the end of your billing cycle.",
        variant: "default",
      });
    } else {
      // Add new add-on
      const newAddOn = featureAddOns.find(a => a.id === addOnId);
      setAddOns([...addOns, {
        id: addOnId,
        name: newAddOn.name,
        price: newAddOn.price[billingCycle],
        billingCycle: billingCycle,
        nextBillingDate: '2025-05-01'
      }]);
      
      toast({
        title: "Add-On Added",
        description: "The add-on has been successfully added to your subscription.",
        variant: "success",
      });
    }
  };
  
  const formatCurrency = (amount) => {
    return `£${amount.toFixed(2)}`;
  };
  
  const calculateSavings = (monthly, annual) => {
    const monthlyCost = monthly * 12;
    const savings = ((monthlyCost - annual) / monthlyCost) * 100;
    return Math.round(savings);
  };
  
  const getCurrentPlan = () => {
    if (!currentSubscription) return null;
    return subscriptionPlans.find(p => p.id === currentSubscription.plan);
  };
  
  const renderUsageProgress = (used, total) => {
    const percentage = total > 0 ? (used / total) * 100 : 0;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{used} / {total}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage & Credits</TabsTrigger>
          <TabsTrigger value="addons">Add-Ons</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>
        
        {/* Subscription Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-centre mb-6">
            <h2 className="text-2xl font-semibold">Choose Your Plan</h2>
            <div className="flex items-centre space-x-2">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : ''}`}>Monthly</span>
              <Switch 
                checked={billingCycle === 'annual'} 
                onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')} 
              />
              <span className={`text-sm ${billingCycle === 'annual' ? 'font-semibold' : ''}`}>
                Annual <Badge variant="outline" className="ml-1">Save up to 17%</Badge>
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${currentSubscription?.plan === plan.id ? 'border-primary' : ''}`}>
                {plan.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary">{plan.badge}</Badge>
                )}
                {currentSubscription?.plan === plan.id && (
                  <Badge className="absolute top-4 left-4 bg-green-600">Current Plan</Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    {formatCurrency(plan.price[billingCycle])}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.price[billingCycle] > 0 ? `/${billingCycle === 'monthly' ? 'month' : 'year'}` : ''}
                    </span>
                  </div>
                  
                  {billingCycle === 'annual' && plan.price.annual > 0 && (
                    <Badge variant="outline" className="mb-4">
                      Save {calculateSavings(plan.price.monthly, plan.price.annual)}%
                    </Badge>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Features:</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Limitations:</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-1 flex-shrink-0" />
                            <span className="text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {plan.aiLimits && Object.values(plan.aiLimits).some(v => v > 0) && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Monthly AI Limits:</h4>
                      <ul className="space-y-1">
                        {plan.aiLimits.recommendations > 0 && (
                          <li className="text-sm">
                            {plan.aiLimits.recommendations} content recommendations
                          </li>
                        )}
                        {plan.aiLimits.progressReports > 0 && (
                          <li className="text-sm">
                            {plan.aiLimits.progressReports} progress reports
                          </li>
                        )}
                        {plan.aiLimits.meetingNotes > 0 && (
                          <li className="text-sm">
                            {plan.aiLimits.meetingNotes} meeting transcriptions
                          </li>
                        )}
                        {plan.aiLimits.lessonPlans > 0 && (
                          <li className="text-sm">
                            {plan.aiLimits.lessonPlans} AI lesson plans
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={currentSubscription?.plan === plan.id ? "outline" : "default"}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={currentSubscription?.plan === plan.id}
                  >
                    {currentSubscription?.plan === plan.id ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Enterprise Plan</h3>
            <p className="mb-4">For large educational networks, districts, and government education departments.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">Features include:</h4>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Custom implementation and integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Advanced security features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>SLA guarantees</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Dedicated support team</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Also includes:</h4>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Unlimited storage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Custom AI model training</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>On-premises deployment options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Custom feature development</span>
                  </li>
                </ul>
              </div>
            </div>
            <Button variant="outline">Contact Sales for Custom Pricing</Button>
          </div>
          
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Special Pricing Programs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-centre">
                    <Users className="h-5 w-5 mr-2" />
                    Educational Discount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">25% discount for verified educational institutions.</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Available on Professional and Institution tiers</li>
                    <li>• Annual billing required</li>
                    <li>• Minimum 5 educator accounts</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Apply Now</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-centre">
                    <Gift className="h-5 w-5 mr-2" />
                    Non-Profit Programme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">40% discount for verified non-profit organizations.</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Available on all paid tiers</li>
                    <li>• Annual billing required</li>
                    <li>• Proof of non-profit status required</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Apply Now</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-centre">
                    <Zap className="h-5 w-5 mr-2" />
                    Startup Programme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">30% discount for EdTech startups under 3 years old.</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Available on Professional and Institution tiers</li>
                    <li>• 12-month maximum program duration</li>
                    <li>• Application and approval required</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Apply Now</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Usage & Credits Tab */}
        <TabsContent value="usage" className="space-y-6">
          {currentSubscription ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>
                      {getCurrentPlan()?.name} ({currentSubscription.billingCycle})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p>{currentSubscription.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Billing Date</p>
                      <p>{currentSubscription.nextBillingDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}>
                        {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Credits</CardTitle>
                    <CardDescription>
                      Use credits for additional AI features beyond your plan limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <span className="text-2xl font-bold">{aiCredits}</span>
                      <span className="text-sm text-muted-foreground">Available Credits</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Credit Usage</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 1 AI-assisted lesson plan = 5 credits</li>
                        <li>• 1 automated progress report = 3 credits</li>
                        <li>• 1 meeting note transcription = 2 credits</li>
                        <li>• 1 AI-powered content recommendation = 1 credit</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Buy More Credits</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Purchase AI Credits</DialogTitle>
                          <DialogDescription>
                            Select a credit package to enhance your AI capabilities.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {creditPackages.map((pkg) => (
                            <div key={pkg.id} className="flex items-centre justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{pkg.name}</h4>
                                <p className="text-sm text-muted-foreground">Save {pkg.savings}</p>
                              </div>
                              <div className="flex items-centre gap-4">
                                <span className="font-bold">{formatCurrency(pkg.price)}</span>
                                <Button size="sm" onClick={() => handleBuyCreditPackage(pkg.id)}>
                                  Purchase
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Usage Limits</CardTitle>
                  <CardDescription>
                    Your current usage for this billing cycle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">AI Content Recommendations</h4>
                        {renderUsageProgress(usageData.aiRecommendations.used, usageData.aiRecommendations.total)}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Automated Progress Reports</h4>
                        {renderUsageProgress(usageData.progressReports.used, usageData.progressReports.total)}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Meeting Note Transcriptions</h4>
                        {renderUsageProgress(usageData.meetingNotes.used, usageData.meetingNotes.total)}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">AI Lesson Plans</h4>
                        {renderUsageProgress(usageData.lessonPlans.used, usageData.lessonPlans.total)}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Storage (MB)</h4>
                        {renderUsageProgress(usageData.storage.used, usageData.storage.total)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Fair Usage Policy</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Storage Limits</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Files must be education-related content</li>
                        <li>• Individual file size limit: 100MB</li>
                        <li>• Unused storage does not roll over</li>
                        <li>• Exceeding storage limits will prompt upgrade options</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>API Usage</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Rate limits apply based on subscription tier</li>
                        <li>• Professional: 1,000 requests/day</li>
                        <li>• Institution: 10,000 requests/day</li>
                        <li>• Enterprise: Custom limits</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>AI Feature Usage</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Usage resets monthly on billing date</li>
                        <li>• Unused AI feature allowances do not roll over</li>
                        <li>• System will prompt for credit purchase when approaching limits</li>
                        <li>• Batch processing counts as multiple uses based on volume</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          ) : (
            <div className="flex items-centre justify-centre h-64">
              <div className="text-centre">
                <h3 className="text-lg font-medium">No active subscription</h3>
                <p className="text-muted-foreground mb-4">Please select a subscription plan to view usage details.</p>
                <Button onClick={() => setActiveTab('plans')}>View Plans</Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Add-Ons Tab */}
        <TabsContent value="addons" className="space-y-6">
          {currentSubscription ? (
            <>
              <div className="flex justify-between items-centre mb-6">
                <h2 className="text-2xl font-semibold">Feature Add-Ons</h2>
                <div className="flex items-centre space-x-2">
                  <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : ''}`}>Monthly</span>
                  <Switch 
                    checked={billingCycle === 'annual'} 
                    onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')} 
                  />
                  <span className={`text-sm ${billingCycle === 'annual' ? 'font-semibold' : ''}`}>
                    Annual <Badge variant="outline" className="ml-1">Save up to 20%</Badge>
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureAddOns.map((addon) => {
                  const isActive = addOns.some(a => a.id === addon.id);
                  return (
                    <Card key={addon.id} className={isActive ? 'border-primary' : ''}>
                      <CardHeader>
                        <CardTitle className="flex items-centre">
                          <Package className="h-5 w-5 mr-2" />
                          {addon.name}
                        </CardTitle>
                        {isActive && (
                          <Badge className="ml-auto">Active</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-4">
                          {formatCurrency(addon.price[billingCycle])}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                            {addon.per ? ` per ${addon.per}` : ''}
                          </span>
                        </div>
                        
                        {addon.id === 'storage' && (
                          <p className="text-sm">Add 10GB of additional storage to your account for storing more resources, assessments, and student data.</p>
                        )}
                        
                        {addon.id === 'analytics' && (
                          <p className="text-sm">Gain deeper insights with advanced analytics, custom reports, and predictive learning patterns.</p>
                        )}
                        
                        {addon.id === 'parent' && (
                          <p className="text-sm">Provide parents with a dedicated portal to track student progress, communicate with teachers, and access resources.</p>
                        )}
                        
                        {addon.id === 'pd' && (
                          <p className="text-sm">Access premium professional development courses, webinars, and resources for continuing education.</p>
                        )}
                        
                        {addon.id === 'blockchain' && (
                          <p className="text-sm">Secure verification of educational achievements and protect intellectual property with blockchain technology.</p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={isActive ? "destructive" : "default"}
                          className="w-full"
                          onClick={() => handleAddOnToggle(addon.id)}
                        >
                          {isActive ? "Remove" : "Add to Subscription"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Your Add-Ons</CardTitle>
                  <CardDescription>
                    Currently active add-ons for your subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {addOns.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Add-On</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Billing Cycle</TableHead>
                          <TableHead>Next Billing Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {addOns.map((addon) => (
                          <TableRow key={addon.id}>
                            <TableCell className="font-medium">{addon.name}</TableCell>
                            <TableCell>{formatCurrency(addon.price)}</TableCell>
                            <TableCell className="capitalize">{addon.billingCycle}</TableCell>
                            <TableCell>{addon.nextBillingDate}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleAddOnToggle(addon.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-centre py-6">
                      <p className="text-muted-foreground">You don't have any active add-ons.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex items-centre justify-centre h-64">
              <div className="text-centre">
                <h3 className="text-lg font-medium">No active subscription</h3>
                <p className="text-muted-foreground mb-4">Please select a subscription plan to add feature add-ons.</p>
                <Button onClick={() => setActiveTab('plans')}>View Plans</Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Billing History Tab */}
        <TabsContent value="billing" className="space-y-6">
          {currentSubscription ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-centre p-4 border rounded-lg mb-4">
                    <div className="mr-4">
                      <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-centre justify-between">
                  <div>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      Your recent invoices and payments
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Download All
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>
                            <Badge variant={invoice.status === 'paid' ? 'outline' : 'destructive'}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Billing FAQs</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>When will I be charged?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        For monthly subscriptions, you'll be charged on the same date each month. For annual subscriptions, you'll be charged once per year on your subscription anniversary date. If your subscription started on the 29th, 30th, or 31st of a month, and the current month doesn't have that many days, you'll be charged on the last day of the month.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I change my subscription?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        You can upgrade your subscription at any time, and the changes will take effect immediately. If you're upgrading from a monthly to an annual plan, you'll be charged the prorated difference. If you're downgrading your subscription, the changes will take effect at the end of your current billing cycle.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and bank transfers for annual Enterprise plans. We do not currently accept cryptocurrency or direct debit payments.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do refunds work?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact our support team within 14 days of your initial purchase for a full refund. After 14 days, we do not offer refunds for subscription payments, but you can cancel your subscription at any time to prevent future charges.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          ) : (
            <div className="flex items-centre justify-centre h-64">
              <div className="text-centre">
                <h3 className="text-lg font-medium">No billing history</h3>
                <p className="text-muted-foreground mb-4">Please select a subscription plan to view billing details.</p>
                <Button onClick={() => setActiveTab('plans')}>View Plans</Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              Enter your payment details to subscribe to the {selectedPlan && subscriptionPlans.find(p => p.id === selectedPlan)?.name} plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="John Smith"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Expiry Date</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-cvc">CVC</Label>
                <Input
                  id="card-cvc"
                  placeholder="123"
                  value={cardCVC}
                  onChange={(e) => setCardCVC(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-centre space-x-2 pt-4">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Your payment information is secure and encrypted</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaymentSubmit}>
              Subscribe Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagement;
