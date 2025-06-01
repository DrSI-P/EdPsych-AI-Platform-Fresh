'use client';

import React from 'react';
import { cn } from '@/components/enhanced-theme-provider';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Flex } from '@/components/ui/enhanced-layout-components';
import { Typography } from '@/components/ui/enhanced-layout-components';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Enhanced Header Component
 * 
 * A consistent header component that implements the brand style guide
 * with responsive design, accessibility features, and age-appropriate adaptations.
 */
export function EnhancedHeader() {
  const { theme, ageGroup, setTheme, setAgeGroup } = useEnhancedTheme();
  
  return (
    <header className="w-full border-b border-border bg-background sticky top-0 z-50">
      <Flex 
        justify="between" 
        align="center" 
        className="container mx-auto py-4 px-4 sm:px-6"
      >
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/images/logo.svg" 
            alt="EdPsych Connect Logo" 
            width={40} 
            height={40}
            className="h-10 w-auto"
          />
          <Typography 
            variant="h5" 
            className="hidden sm:block font-semibold text-primary"
          >
            EdPsych Connect
          </Typography>
        </Link>
        
        {/* Main Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/curriculum-content">Curriculum</NavLink>
          <NavLink href="/learning-path">Learning Path</NavLink>
          <NavLink href="/assessment">Assessment</NavLink>
          <NavLink href="/community">Community</NavLink>
          <NavLink href="/professional-development">Professional</NavLink>
        </nav>
        
        {/* User Controls */}
        <Flex gap="sm" align="center">
          <ThemeToggle />
          <AgeGroupSelector />
          <UserMenu />
          <MobileMenuButton />
        </Flex>
      </Flex>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </header>
  );
}

/**
 * Enhanced Footer Component
 * 
 * A consistent footer component that implements the brand style guide
 * with comprehensive navigation, legal links, and accessibility features.
 */
export function EnhancedFooter() {
  return (
    <footer className="bg-background border-t border-border pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/images/logo.svg" 
                alt="EdPsych Connect Logo" 
                width={40} 
                height={40}
                className="h-10 w-auto"
              />
              <Typography 
                variant="h5" 
                className="font-semibold text-primary"
              >
                EdPsych Connect
              </Typography>
            </Link>
            <Typography variant="small" color="muted" className="mb-4">
              Empowering learners through tailored, evidence-based support and inclusive education.
            </Typography>
            <Flex gap="sm">
              <SocialLink href="https://twitter.com/edpsychconnect" icon="twitter" />
              <SocialLink href="https://facebook.com/edpsychconnect" icon="facebook" />
              <SocialLink href="https://linkedin.com/company/edpsychconnect" icon="linkedin" />
              <SocialLink href="https://youtube.com/edpsychconnect" icon="youtube" />
            </Flex>
          </div>
          
          {/* Quick Links */}
          <div>
            <Typography variant="h6" className="mb-4">Quick Links</Typography>
            <ul className="space-y-2">
              <li><FooterLink href="/curriculum-content">Curriculum Content</FooterLink></li>
              <li><FooterLink href="/learning-path">Learning Path</FooterLink></li>
              <li><FooterLink href="/assessment">Assessment</FooterLink></li>
              <li><FooterLink href="/community">Community</FooterLink></li>
              <li><FooterLink href="/professional-development">Professional Development</FooterLink></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <Typography variant="h6" className="mb-4">Resources</Typography>
            <ul className="space-y-2">
              <li><FooterLink href="/resources/guides">User Guides</FooterLink></li>
              <li><FooterLink href="/resources/research">Research</FooterLink></li>
              <li><FooterLink href="/resources/blog">Blog</FooterLink></li>
              <li><FooterLink href="/resources/webinars">Webinars</FooterLink></li>
              <li><FooterLink href="/resources/support">Support</FooterLink></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <Typography variant="h6" className="mb-4">Legal</Typography>
            <ul className="space-y-2">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/accessibility">Accessibility</FooterLink></li>
              <li><FooterLink href="/contact">Contact Us</FooterLink></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-border pt-6 mt-6">
          <Flex justify="between" align="center" className="flex-col sm:flex-row gap-4">
            <Typography variant="small" color="muted">
              © {new Date().getFullYear()} EdPsych Connect Limited. All rights reserved.
            </Typography>
            <Typography variant="small" color="muted">
              Designed with educational psychology principles for inclusive learning.
            </Typography>
          </Flex>
        </div>
      </div>
    </footer>
  );
}

// Helper Components

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="text-text-primary hover:text-primary transition-colors font-medium"
    >
      {children}
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="text-text-secondary hover:text-primary transition-colors text-sm"
    >
      {children}
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string; icon: string }) {
  return (
    <Link 
      href={href}
      className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
      aria-label={`Visit our ${icon} page`}
    >
      <span className="sr-only">Visit our {icon} page</span>
      {/* Icon would be rendered here */}
    </Link>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useEnhancedTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="sr-only">
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </span>
      {/* Icon would be rendered here */}
    </button>
  );
}

function AgeGroupSelector() {
  const { ageGroup, setAgeGroup } = useEnhancedTheme();
  
  return (
    <select
      value={ageGroup}
      onChange={(e) => setAgeGroup(e.target.value as any)}
      className="h-10 rounded-md border border-border bg-background px-3 text-sm"
      aria-label="Select age group"
    >
      <option value="nursery">Nursery</option>
      <option value="early-primary">Early Primary</option>
      <option value="late-primary">Late Primary</option>
      <option value="secondary">Secondary</option>
    </select>
  );
}

function UserMenu() {
  return (
    <button
      className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
      aria-label="Open user menu"
    >
      <span className="sr-only">Open user menu</span>
      {/* Icon would be rendered here */}
    </button>
  );
}

function MobileMenuButton() {
  return (
    <button
      className="h-10 w-10 rounded-md border border-border flex items-center justify-center text-text-primary md:hidden"
      aria-label="Open mobile menu"
    >
      <span className="sr-only">Open mobile menu</span>
      {/* Icon would be rendered here */}
    </button>
  );
}

function MobileNavigation() {
  // In a real implementation, this would be conditionally shown based on state
  return (
    <div className="hidden">
      <nav className="px-4 py-6 space-y-4">
        <Link href="/curriculum-content" className="block py-2 text-text-primary hover:text-primary">
          Curriculum Content
        </Link>
        <Link href="/learning-path" className="block py-2 text-text-primary hover:text-primary">
          Learning Path
        </Link>
        <Link href="/assessment" className="block py-2 text-text-primary hover:text-primary">
          Assessment
        </Link>
        <Link href="/community" className="block py-2 text-text-primary hover:text-primary">
          Community
        </Link>
        <Link href="/professional-development" className="block py-2 text-text-primary hover:text-primary">
          Professional Development
        </Link>
      </nav>
    </div>
  );
}
