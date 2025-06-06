'use client';

import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown, User, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Comprehensive navigation system that exposes ALL platform features
export default function MasterNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Complete feature categories
  const categories = [
    {
      id: 'student',
      name: 'Student Features',
      features: [
        { name: 'Student Dashboard', path: '/student/dashboard' },
        { name: 'Learning Pathways', path: '/student/learning-path' },
        { name: 'Assessments', path: '/student/assessment' },
        { name: 'Resources', path: '/student/resources' },
        { name: 'Student Voice', path: '/student-voice' },
        { name: 'Analytics', path: '/student-analytics' }
      ]
    },
    {
      id: 'educator',
      name: 'Educator Tools',
      features: [
        { name: 'Educator Dashboard', path: '/innovations/educator-dashboard' },
        { name: 'Assessment Builder', path: '/educator/assessment-builder' },
        { name: 'Classroom Management', path: '/educator/classroom-management' },
        { name: 'Curriculum Planning', path: '/educator/curriculum-planning' },
        { name: 'Data Analytics', path: '/educator/data-analytics' },
        { name: 'Parent Communication', path: '/educator/parent-communication' }
      ]
    },
    {
      id: 'ai',
      name: 'AI Innovations',
      features: [
        { name: 'AI-Powered Tools', path: '/ai-powered-tools' },
        { name: 'AI Assessment', path: '/ai-assessment' },
        { name: 'Content Generation', path: '/ai-content-generation' },
        { name: 'Curriculum Design', path: '/ai-curriculum-design' },
        { name: 'Personalization', path: '/ai-personalization' },
        { name: 'Voice Analytics', path: '/ai-voice-analytics' }
      ]
    },
    {
      id: 'learning',
      name: 'Learning Tools',
      features: [
        { name: 'Learning Analytics', path: '/learning-analytics' },
        { name: 'Path Optimization', path: '/learning-path-optimization' },
        { name: 'Learning Style Assessment', path: '/learning-style-assessment' },
        { name: 'Curriculum Planning', path: '/curriculum-planning' },
        { name: 'Assessment Analytics', path: '/assessment-analytics' },
        { name: 'Progress Pacing', path: '/progress-pacing' }
      ]
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      features: [
        { name: 'Speech-to-Text', path: '/accessibility/speech-to-text' },
        { name: 'Text-to-Speech', path: '/accessibility/text-to-speech' },
        { name: 'Voice Navigation', path: '/accessibility/voice-navigation' },
        { name: 'Enhanced Features', path: '/accessibility/enhanced' },
        { name: 'Voice Input', path: '/voice-input' },
        { name: 'Speech Recognition', path: '/speech-recognition' }
      ]
    },
    {
      id: 'special-needs',
      name: 'Special Needs',
      features: [
        { name: 'Emotional Regulation', path: '/special-needs/emotional-regulation' },
        { name: 'IEP/504 Plans', path: '/special-needs/iep-504-plan' },
        { name: 'Intervention Analytics', path: '/special-needs/intervention-analytics' },
        { name: 'Progress Monitoring', path: '/special-needs/progress-monitoring' },
        { name: 'Sensory Regulation', path: '/special-needs/sensory-regulation' },
        { name: 'Mindfulness', path: '/special-needs/mindfulness' }
      ]
    },
    {
      id: 'restorative',
      name: 'Restorative Justice',
      features: [
        { name: 'Circle Process', path: '/restorative-justice/circle-process' },
        { name: 'Conflict Resolution', path: '/restorative-justice/conflict-resolution' },
        { name: 'Community Building', path: '/restorative-justice/community-building' },
        { name: 'Staff Training', path: '/restorative-justice/staff-training' },
        { name: 'Parent Education', path: '/restorative-justice/parent-education' },
        { name: 'Reflection Prompts', path: '/restorative-justice/reflection-prompts' }
      ]
    },
    {
      id: 'professional',
      name: 'Professional Development',
      features: [
        { name: 'CPD Tracking', path: '/professional-development/cpd-tracking' },
        { name: 'Certification', path: '/professional-development/certification' },
        { name: 'Mentor Matching', path: '/professional-development/mentor-matching' },
        { name: 'Research Collaboration', path: '/professional-development/research-collaboration' },
        { name: 'Webinars', path: '/professional-development/webinars' },
        { name: 'Portfolio', path: '/professional-development/portfolio' }
      ]
    },
    {
      id: 'videos',
      name: 'Videos & Media',
      features: [
        { name: 'Dr. Scott Videos', path: '/ai-avatar-videos' },
        { name: 'Interactive Avatar', path: '/interactive-avatar' },
        { name: 'Video Integration', path: '/videos/integration' },
        { name: 'Multimedia Content', path: '/multimedia-content' },
        { name: 'Immersive Experiences', path: '/immersive-experiences' }
      ]
    },
    {
      id: 'about',
      name: 'About',
      features: [
        { name: 'About Us', path: '/about' },
        { name: 'Meet Dr. Scott', path: '/meet-dr-scott' },
        { name: 'Platform Overview', path: '/platform-overview' },
        { name: 'Meet the Team', path: '/about/team' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' }
      ]
    },
    {
      id: 'blog',
      name: 'Blog & Resources',
      features: [
        { name: 'Educational Blog', path: '/blog' },
        { name: 'Research Articles', path: '/blog/research' },
        { name: 'Case Studies', path: '/blog/case-studies' },
        { name: 'Best Practices', path: '/blog/best-practices' },
        { name: 'News & Updates', path: '/blog/news' }
      ]
    }
  ];

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/images/logo-full.svg" 
                alt="EdPsych Connect" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {categories.map((category) => (
              <div key={category.id} className="relative group">
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 flex items-center"
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                >
                  {category.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                <div className={cn(
                  "absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out transform origin-top-right",
                  activeCategory === category.id ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                )}>
                  <div className="py-1">
                    {category.features.map((feature) => (
                      <Link
                        key={feature.path}
                        href={feature.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {feature.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search features..."
                className="w-64 pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const searchTerm = (e.target as HTMLInputElement).value;
                    if (searchTerm.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
                    }
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <Link href="/auth/login">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
            
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 flex items-center justify-between"
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              >
                {category.name}
                <ChevronDown className={`h-4 w-4 transition-transform ${activeCategory === category.id ? 'rotate-180' : ''}`} />
              </button>
              
              {activeCategory === category.id && (
                <div className="pl-4 space-y-1 mt-1">
                  {category.features.map((feature) => (
                    <Link
                      key={feature.path}
                      href={feature.path}
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {feature.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search features..."
                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const searchTerm = (e.target as HTMLInputElement).value;
                    if (searchTerm.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
                    }
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <Link href="/auth/login" className="block">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
            
            <Link href="/auth/register" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

