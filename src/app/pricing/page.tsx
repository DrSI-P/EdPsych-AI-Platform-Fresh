'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComprehensiveNavigation from '@/components/navigation/comprehensive-navigation';
import { 
  Check, 
  Star, 
  Users, 
  Building, 
  Crown,
  ArrowRight,
  Sparkles,
  Shield,
  Headphones,
  Zap
} from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Student',
      description: 'Perfect for individual students and learners',
      icon: Users,
      color: 'blue',
      monthly: 9.99,
      annual: 99.99,
      features: [
        'Personal learning dashboard',
        'Progress tracking and analytics',
        'AI-powered study recommendations',
        'Basic assessment tools',
        'Community forum access',
        'Mobile app access',
        'Email support'
      ],
      limitations: [
        'Limited to 1 user',
        'Basic reporting features',
        'Standard support'
      ],
      popular: false
    },
    {
      name: 'Educator',
      description: 'Designed for teachers and educational professionals',
      icon: Star,
      color: 'purple',
      monthly: 29.99,
      annual: 299.99,
      features: [
        'Everything in Student plan',
        'Classroom management tools',
        'Advanced assessment creation',
        'Student analytics dashboard',
        'Curriculum planning tools',
        'Parent communication portal',
        'Professional development resources',
        'Priority email support',
        'Video conferencing integration'
      ],
      limitations: [
        'Up to 30 students per class',
        'Limited admin features'
      ],
      popular: true
    },
    {
      name: 'School',
      description: 'Comprehensive solution for educational institutions',
      icon: Building,
      color: 'green',
      monthly: 99.99,
      annual: 999.99,
      features: [
        'Everything in Educator plan',
        'Unlimited students and educators',
        'Advanced admin dashboard',
        'Custom branding options',
        'API access and integrations',
        'Advanced reporting and analytics',
        'Staff training and onboarding',
        'Dedicated account manager',
        'Phone and chat support',
        'Custom workflows'
      ],
      limitations: [
        'Minimum 50 users',
        'Annual commitment required'
      ],
      popular: false
    },
    {
      name: 'Enterprise',
      description: 'Tailored solutions for large organizations',
      icon: Crown,
      color: 'gold',
      monthly: 'Custom',
      annual: 'Custom',
      features: [
        'Everything in School plan',
        'Custom feature development',
        'White-label solutions',
        'Advanced security features',
        'Compliance certifications',
        'Multi-tenant architecture',
        'Custom integrations',
        '24/7 premium support',
        'On-site training',
        'Service level agreements'
      ],
      limitations: [],
      popular: false
    }
  ];

  const addOns = [
    {
      name: 'AI Avatar Videos',
      description: 'Access to Dr. Scott\'s comprehensive video library',
      price: 19.99,
      features: [
        '14 Dr. Scott I-Patrick videos',
        'Interactive avatar responses',
        'Personalized guidance',
        'Professional insights'
      ]
    },
    {
      name: 'Advanced Analytics',
      description: 'Deep insights and predictive analytics',
      price: 14.99,
      features: [
        'Predictive learning analytics',
        'Advanced reporting dashboard',
        'Custom report generation',
        'Data export capabilities'
      ]
    },
    {
      name: 'Premium Support',
      description: '24/7 priority support with dedicated specialist',
      price: 24.99,
      features: [
        '24/7 phone and chat support',
        'Dedicated support specialist',
        'Priority response times',
        'Training and onboarding'
      ]
    }
  ];

  const getPrice = (plan: any) => {
    if (plan.monthly === 'Custom') return 'Custom';
    const price = billingCycle === 'monthly' ? plan.monthly : plan.annual;
    return `£${price}`;
  };

  const getSavings = (plan: any) => {
    if (plan.monthly === 'Custom') return null;
    const monthlyCost = plan.monthly * 12;
    const savings = monthlyCost - plan.annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ComprehensiveNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Flexible Pricing Plans
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose the Perfect Plan for Your Educational Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From individual learners to large institutions, we have a plan that fits your needs and budget.
            Start with a free trial and upgrade anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save up to 17%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => {
            const savings = getSavings(plan);
            return (
              <Card 
                key={plan.name} 
                className={`relative ${
                  plan.popular 
                    ? 'border-purple-200 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                } transition-all duration-200`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${
                    plan.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    plan.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    plan.color === 'green' ? 'from-green-500 to-green-600' :
                    'from-yellow-500 to-yellow-600'
                  } flex items-center justify-center`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                  
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {getPrice(plan)}
                      {plan.monthly !== 'Custom' && (
                        <span className="text-lg font-normal text-gray-600">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annual' && savings && (
                      <div className="text-sm text-green-600 font-medium">
                        Save £{savings.amount} ({savings.percentage}%)
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    asChild
                  >
                    <Link href="/auth/register">
                      {plan.monthly === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhance Your Experience</h2>
            <p className="text-gray-600">Add powerful features to any plan</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <Card key={addon.name} className="border-gray-200 hover:border-gray-300 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{addon.description}</p>
                  <div className="text-2xl font-bold text-gray-900">
                    £{addon.price}<span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {addon.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full">
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EdPsych Connect?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-600">Bank-level encryption and GDPR compliance to keep your data safe</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Get help from qualified educational psychologists and technical experts</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">Evidence-based tools that improve learning outcomes and wellbeing</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Education?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of educators and students already using EdPsych Connect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/auth/register">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

