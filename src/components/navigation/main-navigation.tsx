'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Brain,
  BookOpen,
  Accessibility,
  Users,
  Globe,
  MessageCircle,
  Menu,
  X,
  Heart,
  Award
} from 'lucide-react';

interface NavigationProps {
  onAvatarClick?: () => void;
}

export default function MainNavigation({ onAvatarClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { title: "Dashboards", href: "/platform-overview", icon: BarChart3 },
    { title: "AI Innovations", href: "/platform-overview", icon: Brain },
    { title: "Learning Tools", href: "/platform-overview", icon: BookOpen },
    { title: "Accessibility", href: "/accessibility", icon: Accessibility },
    { title: "Community", href: "/platform-overview", icon: Users }
  ];

  const quickActions = [
    { title: "About Us", href: "/about", icon: Heart },
    { title: "Contact", href: "/contact", icon: MessageCircle }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EdPsych Connect
                </div>
                <div className="text-xs text-gray-500">Educational Psychology Platform</div>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.title}</span>
                </a>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onAvatarClick}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask Dr. Scott</span>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.href = '/platform-overview'}
            >
              <Globe className="w-4 h-4 mr-2" />
              Explore Platform
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.title}</span>
                  </a>
                );
              })}
              
              {/* Mobile Quick Actions */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onAvatarClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Dr. Scott
                </Button>
                <Button
                  size="sm"
                  className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => {
                    window.location.href = '/platform-overview';
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Explore Platform
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

