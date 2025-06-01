'use client';

/**
 * AI Avatar Navigation System Component
 * 
 * This component provides contextual navigation assistance through AI-powered
 * avatar videos, helping users navigate the EdPsych AI Education Platform.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { HelpCircle, X, Volume2, VolumeX } from 'lucide-react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

// Navigation context mapping
const NAVIGATION_CONTEXTS: Record<string, string> = {
  '/': 'welcome',
  '/dashboard': 'dashboard',
  '/curriculum': 'curriculum',
  '/progress': 'progress-tracking',
  '/settings': 'settings',
  '/accessibility': 'accessibility',
  '/pricing': 'pricing',
  '/profile': 'profile',
  '/help': 'help',
  '/register': 'registration',
  '/login': 'login',
};

// User role mapping
const USER_ROLES: Record<string, string> = {
  'STUDENT_PRIMARY': 'student-primary',
  'STUDENT_SECONDARY': 'student-secondary',
  'TEACHER': 'educator',
  'PARENT': 'parent',
  'ADMIN': 'admin',
  'CONTENT_CREATOR': 'content-creator',
};

interface AvatarNavigationProps {
  autoShowOnFirstVisit?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
}

interface NavigationVideo {
  url: string;
  id: string;
}

interface NavigationVideoResponse {
  videos: any[];
}

export default function AvatarNavigation({
  autoShowOnFirstVisit = true,
  position = 'bottom-right',
  size = 'md',
}: AvatarNavigationProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [visitedPages, setVisitedPages] = useLocalStorage<Record<string, boolean>>('avatar-visited-pages', {});
  const [disableAutoShow, setDisableAutoShow] = useLocalStorage<boolean>('avatar-disable-auto-show', false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Determine the current context based on the pathname
  const getCurrentContext = useCallback(() => {
    if (!pathname) return 'welcome';
    
    // Exact match
    if (NAVIGATION_CONTEXTS[pathname]) {
      return NAVIGATION_CONTEXTS[pathname];
    }
    
    // Partial match for nested routes
    for (const [path, context] of Object.entries(NAVIGATION_CONTEXTS)) {
      if (path !== '/' && pathname.startsWith(path)) {
        return context;
      }
    }
    
    // Default to welcome if no match
    return 'welcome';
  }, [pathname]);
  
  // Determine user role from session
  const getUserRole = useCallback(() => {
    if (!session?.user) return 'guest';
    
    const userRole = (session.user as any).role || 'STUDENT_SECONDARY';
    return USER_ROLES[userRole] || 'student-secondary';
  }, [session]);
  
  // Load the appropriate navigation video
  const loadNavigationVideo = useCallback(async () => {
    if (!pathname) return;
    
    const context = getCurrentContext();
    const role = getUserRole();
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to get a cost-managed video specific to this context and role
      const response = await fetch(`/api/heygen/cost-managed-videos?category=navigation-${context}-${role}`);
      
      if (!response.ok) {
        throw new Error('Failed to load navigation video');
      }
      
      const data = await response.json() as NavigationVideoResponse;
      
      if (data.videos && data.videos.length > 0) {
        // Use the first video from the results
        setVideoUrl(data.videos[0].url);
      } else {
        // Fallback to a generic video for this context
        const fallbackResponse = await fetch(`/api/heygen/cost-managed-videos?category=navigation-${context}`);
        
        if (!fallbackResponse.ok) {
          throw new Error('Failed to load fallback navigation video');
        }
        
        const fallbackData = await fallbackResponse.json() as NavigationVideoResponse;
        
        if (fallbackData.videos && fallbackData.videos.length > 0) {
          setVideoUrl(fallbackData.videos[0].url);
        } else {
          throw new Error('No navigation videos available for this context');
        }
      }
    } catch (err) {
      console.error('Error loading navigation video:', err);
      setError('Failed to load navigation assistance. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [pathname, getCurrentContext, getUserRole]);
  
  // Check if this is the first visit to this page
  const isFirstVisit = useCallback(() => {
    if (!pathname || disableAutoShow) return false;
    return !visitedPages[pathname];
  }, [pathname, visitedPages, disableAutoShow]);
  
  // Mark the current page as visited
  const markAsVisited = useCallback(() => {
    if (!pathname) return;
    setVisitedPages(prev => ({
      ...prev,
      [pathname]: true
    }));
  }, [pathname, setVisitedPages]);
  
  // Auto-show on first visit to a page
  useEffect(() => {
    if (autoShowOnFirstVisit && isFirstVisit()) {
      loadNavigationVideo().then(() => {
        setOpen(true);
        markAsVisited();
      });
    }
  }, [pathname, autoShowOnFirstVisit, isFirstVisit, loadNavigationVideo, markAsVisited]);
  
  // Handle manual open
  const handleOpen = () => {
    loadNavigationVideo();
    setOpen(true);
  };
  
  // Position classes
  const positionClasses: Record<string, string> = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };
  
  // Size classes
  const sizeClasses: Record<string, string> = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
  };
  
  // Dialog size classes
  const dialogSizeClasses: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
  };
  
  return (
    <>
      {/* Floating help button */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={`rounded-full shadow-lg ${sizeClasses[size]}`}
                onClick={handleOpen}
              >
                <HelpCircle className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get navigation assistance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Navigation assistance dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${dialogSizeClasses[size]} p-0 overflow-hidden rounded-lg`}>
          <DialogHeader className="p-4 flex flex-row items-center justify-between">
            <DialogTitle>Navigation Assistance</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMuted(!muted)}
                className="h-8 w-8"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          
          <div className="relative aspect-video w-full bg-muted">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center text-destructive">
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => loadNavigationVideo()}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            {videoUrl && !loading && !error && (
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                controls={false}
                muted={muted}
                loop
              />
            )}
          </div>
          
          <div className="p-4 bg-background">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDisableAutoShow(!disableAutoShow);
                }}
              >
                {disableAutoShow ? 'Enable Auto-Show' : 'Disable Auto-Show'}
              </Button>
              
              <DialogClose asChild>
                <Button size="sm">Got It</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
