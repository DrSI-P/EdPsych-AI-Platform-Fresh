'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button, Input, Select } from '@/components/ui/enhanced-form-components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/enhanced-interactive-components';
import { PricingCard } from '@/components/ui/enhanced-marketing-components';
import Image from 'next/image';
import Link from 'next/link';

export default function PricingPage() {
  const { ageGroup } = useEnhancedTheme();
  
  // Pricing plans for individuals
  const individualPlans = [
    {
      title: "Basic",
      price: "£4.99",
      period: "per month",
      description: "Essential learning tools for individual students",
      features: [
        "Access to core curriculum content",
        "Personalized learning path",
        "Basic progress tracking",
        "Limited assessment tools",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      title: "Standard",
      price: "£9.99",
      period: "per month",
      description: "Enhanced learning experience with additional tools",
      features: [
        "Everything in Basic",
        "Full curriculum access",
        "Advanced learning analytics",
        "Comprehensive assessment tools",
        "Voice input support",
        "Priority email support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      title: "Premium",
      price: "£14.99",
      period: "per month",
      description: "Complete learning solution with all features",
      features: [
        "Everything in Standard",
        "AI tutoring sessions",
        "Specialized content for SEN",
        "Offline access to materials",
        "Parent/guardian dashboard",
        "24/7 priority support"
      ],
      cta: "Start Free Trial",
      popular: false
    }
  ];
  
  // Pricing plans for schools
  const schoolPlans = [
    {
      title: "School Essentials",
      price: "£499",
      period: "per year",
      description: "For small schools up to 100 students",
      features: [
        "Access for up to 100 students",
        "Teacher dashboard",
        "Basic analytics and reporting",
        "Standard curriculum content",
        "Email support"
      ],
      cta: "Contact Sales",
      popular: false
    },
    {
      title: "School Advanced",
      price: "£999",
      period: "per year",
      description: "For medium schools up to 250 students",
      features: [
        "Access for up to 250 students",
        "Everything in School Essentials",
        "Advanced teacher tools",
        "Comprehensive analytics",
        "Custom learning paths",
        "Priority support"
      ],
      cta: "Contact Sales",
      popular: true
    },
    {
      title: "School Premium",
      price: "Custom",
      period: "pricing",
      description: "For large schools and multi-academy trusts",
      features: [
        "Unlimited student access",
        "Everything in School Advanced",
        "Custom integration options",
        "Staff training and onboarding",
        "Dedicated account manager",
        "24/7 premium support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];
  
  // Feature comparison
  const featureComparison = [
    {
      category: "Core Features",
      features: [
        {
          name: "UK Curriculum Content",
          basic: "Limited",
          standard: "Full",
          premium: "Full + Specialized"
        },
        {
          name: "Personalized Learning Paths",
          basic: "Basic",
          standard: "Advanced",
          premium: "Advanced + AI"
        },
        {
          name: "Progress Tracking",
          basic: "Basic",
          standard: "Advanced",
          premium: "Comprehensive"
        }
      ]
    },
    {
      category: "Educational Psychology Features",
      features: [
        {
          name: "Learning Style Adaptation",
          basic: "Limited",
          standard: "Full",
          premium: "Full + Custom"
        },
        {
          name: "Behavior Support Tools",
          basic: "✖",
          standard: "Basic",
          premium: "Advanced"
        },
        {
          name: "Executive Function Support",
          basic: "✖",
          standard: "Basic",
          premium: "Advanced"
        }
      ]
    },
    {
      category: "Accessibility",
      features: [
        {
          name: "Voice Input",
          basic: "✖",
          standard: "✓",
          premium: "Enhanced"
        },
        {
          name: "Text Customization",
          basic: "Basic",
          standard: "Advanced",
          premium: "Advanced"
        },
        {
          name: "Language Support",
          basic: "English Only",
          standard: "Multiple",
          premium: "Comprehensive"
        }
      ]
    },
    {
      category: "Support",
      features: [
        {
          name: "Customer Support",
          basic: "Email",
          standard: "Priority Email",
          premium: "24/7 Priority"
        },
        {
          name: "Training Resources",
          basic: "Limited",
          standard: "Full Access",
          premium: "Full + Custom"
        },
        {
          name: "Community Access",
          basic: "✖",
          standard: "✓",
          premium: "Premium"
        }
      ]
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h1" className="mb-4">
                Simple, Transparent Pricing
              </Typography>
              <Typography variant="lead" className="mb-8">
                Choose the plan that's right for you, your family, or your school.
              </Typography>
              
              <Tabs defaultValue="individual" className="w-full">
                <TabsList className="mx-auto">
                  <TabsTrigger value="individual">Individual</TabsTrigger>
                  <TabsTrigger value="family">Family</TabsTrigger>
                  <TabsTrigger value="school">School</TabsTrigger>
                </TabsList>
                
                <TabsContent value="individual" className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {individualPlans.map((plan, index) => (
                      <PricingCard
                        key={index}
                        title={plan.title}
                        price={plan.price}
                        period={plan.period}
                        description={plan.description}
                        features={plan.features}
                        ctaText={plan.cta}
                        popular={plan.popular}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="family" className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard
                      title="Family Basic"
                      price="£9.99"
                      period="per month"
                      description="For families with up to 2 children"
                      features={[
                        "Access for 2 children",
                        "Core curriculum content",
                        "Basic personalization",
                        "Parent dashboard",
                        "Email support"
                      ]}
                      ctaText="Start Free Trial"
                      popular={false}
                    />
                    <PricingCard
                      title="Family Plus"
                      price="£14.99"
                      period="per month"
                      description="For families with up to 4 children"
                      features={[
                        "Access for 4 children",
                        "Full curriculum access",
                        "Advanced personalization",
                        "Comprehensive parent dashboard",
                        "Voice input support",
                        "Priority support"
                      ]}
                      ctaText="Start Free Trial"
                      popular={true}
                    />
                    <PricingCard
                      title="Family Premium"
                      price="£19.99"
                      period="per month"
                      description="For larger families with unlimited children"
                      features={[
                        "Unlimited child accounts",
                        "Everything in Family Plus",
                        "AI tutoring sessions",
                        "Specialized SEN content",
                        "Offline access",
                        "24/7 priority support"
                      ]}
                      ctaText="Start Free Trial"
                      popular={false}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="school" className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {schoolPlans.map((plan, index) => (
                      <PricingCard
                        key={index}
                        title={plan.title}
                        price={plan.price}
                        period={plan.period}
                        description={plan.description}
                        features={plan.features}
                        ctaText={plan.cta}
                        popular={plan.popular}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Container>
        </section>
        
        {/* Feature Comparison */}
        <section className="py-16">
          <Container>
            <Typography variant="h2" className="mb-12 text-center">
              Feature Comparison
            </Typography>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-6 text-left">Feature</th>
                    <th className="py-4 px-6 text-center">Basic</th>
                    <th className="py-4 px-6 text-center bg-primary/5">Standard</th>
                    <th className="py-4 px-6 text-center">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td colSpan={4} className="py-3 px-6 font-medium">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-b border-gray-200">
                          <td className="py-3 px-6">{feature.name}</td>
                          <td className="py-3 px-6 text-center">{feature.basic}</td>
                          <td className="py-3 px-6 text-center bg-primary/5">{feature.standard}</td>
                          <td className="py-3 px-6 text-center">{feature.premium}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Typography variant="h2" className="mb-8 text-center">
                Frequently Asked Questions
              </Typography>
              
              <Tabs defaultValue="billing" className="w-full">
                <TabsList className="mx-auto">
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="plans">Plans</TabsTrigger>
                  <TabsTrigger value="schools">Schools</TabsTrigger>
                </TabsList>
                
                <TabsContent value="billing" className="pt-8 space-y-6">
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      How does billing work?
                    </Typography>
                    <Typography variant="body">
                      For individual and family plans, we offer monthly or annual billing options. Annual plans come with a 20% discount. School plans are billed annually. All plans can be paid via credit card, debit card, or direct debit.
                    </Typography>
                  </Card>
                  
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      Can I cancel my subscription at any time?
                    </Typography>
                    <Typography variant="body">
                      Yes, you can cancel your subscription at any time. For monthly plans, your access will continue until the end of the current billing period. For annual plans, we offer a 30-day money-back guarantee, after which no refunds are provided for the remaining subscription period.
                    </Typography>
                  </Card>
                  
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      Do you offer any discounts?
                    </Typography>
                    <Typography variant="body">
                      Yes, we offer a 20% discount on all annual plans. We also offer special pricing for schools in disadvantaged areas and non-profit educational organizations. Contact our sales team for more information.
                    </Typography>
                  </Card>
                </TabsContent>
                
                <TabsContent value="plans" className="pt-8 space-y-6">
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      Can I switch between plans?
                    </Typography>
                    <Typography variant="body">
                      Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll have immediate access to the new features and will be charged the prorated difference. When downgrading, the change will take effect at the start of your next billing cycle.
                    </Typography>
                  </Card>
                  
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      What's included in the free trial?
                    </Typography>
                    <Typography variant="body">
                      Our 14-day free trial includes full access to all features of the Standard plan for individual and family subscriptions. No credit card is required to start a trial, and you'll receive a reminder before it ends.
                    </Typography>
                  </Card>
                  
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      How do family plans work?
                    </Typography>
                    <Typography variant="body">
                      Family plans allow you to create multiple child accounts under a single parent/guardian account. Each child gets their own personalized learning experience, while parents can monitor progress and manage settings from a central dashboard.
                    </Typography>
                  </Card>
                </TabsContent>
                
                <TabsContent value="schools" className="pt-8 space-y-6">
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      How do school licenses work?
                    </Typography>
                    <Typography variant="body">
                      School licenses are based on the number of students who will be using the platform. We offer flexible options for schools of all sizes, from small primary schools to large multi-academy trusts. Each student gets their own account, and teachers have access to management dashboards.
                    </Typography>
                  </Card>
                  
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      Do you offer training for schools?
                    </Typography>
                    <Typography variant="body">
                      Yes, all school plans include initial training sessions for staff. School Premium plans include comprehensive onboarding and regular training updates. We also offer additional training packages for schools that need more support.
                    </Typography>
                  </Card>
                  
                  <Card className="p-6">
                    <Typography variant="h5" className="mb-2">
                      Can we integrate with our existing systems?
                    </Typography>
                    <Typography variant="body">
                      Yes, our School Premium plan includes custom integration options with popular school management systems, learning management systems, and single sign-on solutions. Our technical team will work with you to ensure a smooth integration.
                    </Typography>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </Container>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h2" className="mb-4">
                Ready to Get Started?
              </Typography>
              <Typography variant="lead" className="mb-8">
                Join thousands of students, teachers, and schools already benefiting from EdPsych Connect.
              </Typography>
              <Flex gap="md" justify="center">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
                <Button variant="secondary" size="lg">
                  Contact Sales
                </Button>
              </Flex>
            </div>
          </Container>
        </section>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
