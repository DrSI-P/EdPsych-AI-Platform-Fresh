'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogIn, 
  UserPlus, 
  Settings, 
  Menu, 
  X,
  ChevronDown,
  Home,
  BarChart3,
  Brain,
  BookOpen,
  Accessibility,
  Users,
  CreditCard,
  Shield,
  Phone,
  Info
} from 'lucide-react';

export default function ComprehensiveNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  const navigationSections = [
    {
      title: 'Dashboards',
      icon: BarChart3,
      color: 'blue',
      items: [
        { name: 'Platform Overview', href: '/platform-overview' },
        { name: 'Student Dashboard', href: '/innovations/student-dashboard' },
        { name: 'Educator Dashboard', href: '/innovations/educator-dashboard' },
        { name: 'Parent Dashboard', href: '/innovations/parent-dashboard' },
        { name: 'Professional Dashboard', href: '/innovations/professional-dashboard' },
        { name: 'Admin Dashboard', href: '/admin/dashboard' }
      ]
    },
    {
      title: 'AI Innovations',
      icon: Brain,
      color: 'purple',
      items: [
        { name: 'AI Avatar Videos', href: '/ai-avatar-videos' },
        { name: 'AI-Powered Insights', href: '/ai-powered-insights' },
        { name: 'AI Tutoring', href: '/ai-tutoring' },
        { name: 'AI Assessment', href: '/ai-assessment' },
        { name: 'AI Curriculum Design', href: '/ai-curriculum-design' },
        { name: 'Interactive Avatar', href: '/ai-avatar-videos' }
      ]
    },
    {
      title: 'Learning Tools',
      icon: BookOpen,
      color: 'green',
      items: [
        { name: 'Assessment Tools', href: '/assessment-tools' },
        { name: 'Curriculum Planning', href: '/curriculum-planning' },
        { name: 'Learning Analytics', href: '/learning-analytics' },
        { name: 'Progress Tracking', href: '/progress-tracking' },
        { name: 'Collaborative Learning', href: '/collaborative-learning' },
        { name: 'Resources Library', href: '/resources' }
      ]
    },
    {
      title: 'Accessibility',
      icon: Accessibility,
      color: 'teal',
      items: [
        { name: 'Speech-to-Text', href: '/accessibility/speech-to-text' },
        { name: 'Text-to-Speech', href: '/accessibility/text-to-speech' },
        { name: 'Voice Navigation', href: '/accessibility/voice-navigation' },
        { name: 'Enhanced Features', href: '/accessibility/enhanced' },
        { name: 'Special Needs Support', href: '/special-needs' },
        { name: 'Accessibility Settings', href: '/settings/accessibility' }
      ]
    },
    {
      title: 'Community',
      icon: Users,
      color: 'pink',
      items: [
        { name: 'Community Hub', href: '/community' },
        { name: 'Forums', href: '/forums' },
        { name: 'Events', href: '/events' },
        { name: 'Professional Development', href: '/professional-development' },
        { name: 'Restorative Justice', href: '/restorative-justice' },
        { name: 'Networking', href: '/networking' }
      ]
    }
  ];

  const authItems = [
    { name: 'Sign In', href: '/auth/login', icon: LogIn },
    { name: 'Register', href: '/auth/register', icon: UserPlus },
    { name: 'Pricing', href: '/pricing', icon: CreditCard }
  ];

  const businessItems = [
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    { name: 'Terms of Service', href: '/terms', icon: Shield }
  ];

  const toggleDropdown = (section: string) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EdPsych Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Home */}
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>

            {/* Main Navigation Sections */}
            {navigationSections.map((section) => (
              <div key={section.title} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown(section.title)}
                >
                  <section.icon className="w-4 h-4" />
                  <span>{section.title}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>

                {activeDropdown === section.title && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-2">
                      {section.items.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Ask Dr. Scott */}
            <Link href="/ai-avatar-videos">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Ask Dr. Scott
              </Button>
            </Link>
          </div>

          {/* Auth & Business Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {authItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
            
            {/* Business Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleDropdown('business')}
                className="flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </Button>

              {activeDropdown === 'business' && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-2">
                    {businessItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Home */}
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>

              {/* Navigation Sections */}
              {navigationSections.map((section) => (
                <div key={section.title}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => toggleDropdown(`mobile-${section.title}`)}
                  >
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.title}
                    <ChevronDown className="w-3 h-3 ml-auto" />
                  </Button>
                  
                  {activeDropdown === `mobile-${section.title}` && (
                    <div className="ml-4 space-y-1">
                      {section.items.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Auth Items */}
              <div className="border-t pt-2">
                {authItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Business Items */}
              <div className="border-t pt-2">
                {businessItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

